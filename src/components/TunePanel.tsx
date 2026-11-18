"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ACCENTS, type Accent, type Theme, tune, useTune } from "@/lib/tune";

const SWATCHES: Accent[] = ["iris", "mint", "amber", "rose"];
const THEMES: { id: Theme; label: string }[] = [
  { id: "dark", label: "Dark" },
  { id: "paper", label: "Paper" },
];

export function TunePanel() {
  const panel = useTune((t) => t.panel);
  const intro = useTune((t) => t.intro);
  if (panel === "hidden") return null;
  const open = panel === "open";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      style={{ borderRadius: open ? 18 : 999 }}
      className={`fixed right-4 bottom-4 z-50 border border-line bg-slate/95 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] backdrop-blur ${
        open ? "w-[calc(100vw-2rem)] sm:w-76" : ""
      }`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {open ? (
          <motion.div
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5"
          >
            <div className="flex items-baseline justify-between">
              <p className="font-display text-lg" style={{ fontVariationSettings: `"wght" 560, "wdth" 90` }}>
                Tune this site
              </p>
              {intro === "done" && (
                <button
                  type="button"
                  onClick={() => tune.set({ panel: "closed" })}
                  className="-mr-1 rounded px-1 text-sm text-fog hover:text-bone"
                >
                  Close
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-fog">Changes apply to the whole page.</p>
            <div className="mt-5 space-y-5">
              <TuneSlider id="wght" label="Weight" min={200} max={800} format={(v) => `${Math.round(v)}`} />
              <TuneSlider id="wdth" label="Width" min={75} max={100} format={(v) => `${Math.round(v)}%`} />
              <Accents />
              <Themes />
            </div>
            {intro === "done" && (
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "instant" });
                  tune.set({ intro: "pending", run: tune.get().run + 1 });
                }}
                className="mt-6 text-sm text-iris underline decoration-iris/40 underline-offset-4 hover:decoration-iris"
              >
                Replay intro
              </button>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="closed"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => tune.set({ panel: "open" })}
            className="flex items-center gap-2.5 py-2.5 pr-4 pl-3 text-sm text-bone"
          >
            <span aria-hidden className="size-3 rounded-full bg-iris" />
            Tune this site
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TuneSlider({
  id,
  label,
  min,
  max,
  format,
}: {
  id: "wght" | "wdth";
  label: string;
  min: number;
  max: number;
  format: (v: number) => string;
}) {
  const value = useTune((t) => t[id]);
  const track = useRef<HTMLDivElement>(null);
  const pct = ((value - min) / (max - min)) * 100;

  const setFromX = (clientX: number) => {
    const r = track.current?.getBoundingClientRect();
    if (!r) return;
    const t = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    tune.set({ [id]: min + t * (max - min) });
  };

  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-fog" id={`tune-${id}`}>
          {label}
        </span>
        <span className="tabular-nums text-bone">{format(value)}</span>
      </div>
      <div
        ref={track}
        className="relative mt-2 h-6 cursor-pointer touch-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromX(e.clientX);
        }}
      >
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
        <div className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-iris" style={{ width: `${pct}%` }} />
        <div
          role="slider"
          tabIndex={0}
          aria-labelledby={`tune-${id}`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={Math.round(value)}
          aria-valuetext={format(value)}
          data-tune-thumb={id}
          onKeyDown={(e) => {
            const step = (max - min) / (e.shiftKey ? 5 : 25);
            if (e.key === "ArrowRight" || e.key === "ArrowUp") tune.set({ [id]: Math.min(max, value + step) });
            else if (e.key === "ArrowLeft" || e.key === "ArrowDown") tune.set({ [id]: Math.max(min, value - step) });
            else return;
            e.preventDefault();
          }}
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-iris bg-bone"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Accents() {
  const accent = useTune((t) => t.accent);
  const theme = useTune((t) => t.theme);
  return (
    <div>
      <p className="text-sm text-fog" id="tune-accent">
        Accent
      </p>
      <div role="radiogroup" aria-labelledby="tune-accent" className="mt-2 flex gap-3">
        {SWATCHES.map((a) => (
          <button
            key={a}
            type="button"
            role="radio"
            aria-checked={accent === a}
            aria-label={ACCENTS[a].label}
            data-tune-accent={a}
            onClick={() => tune.set({ accent: a })}
            className="relative grid size-8 place-items-center rounded-full"
          >
            {accent === a && (
              <motion.span
                layoutId="accent-ring"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-full border-2 border-bone"
              />
            )}
            <span className="size-5 rounded-full" style={{ background: ACCENTS[a][theme] }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Themes() {
  const theme = useTune((t) => t.theme);
  return (
    <div>
      <p className="text-sm text-fog" id="tune-theme">
        Theme
      </p>
      <div role="radiogroup" aria-labelledby="tune-theme" className="mt-2 inline-flex rounded-full border border-line p-1">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={theme === t.id}
            onClick={() => tune.set({ theme: t.id })}
            className={`relative rounded-full px-4 py-1 text-sm ${theme === t.id ? "text-graphite" : "text-fog hover:text-bone"}`}
          >
            {theme === t.id && (
              <motion.span
                layoutId="theme-pill"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                className="absolute inset-0 rounded-full bg-bone"
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
