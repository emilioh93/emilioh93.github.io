"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FINAL, START, tune, useTune } from "@/lib/tune";

const NAME = ["Emilio", "Hurtado"];
const LETTER_COUNT = NAME.join("").length;
const COLUMNS = 12;

type Stage = "grid" | "type" | "select" | "tune" | "handoff" | "done";

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

class Cancelled extends Error {}

export function Hero() {
  const reduce = useReducedMotion();
  const h1 = useRef<HTMLHeadingElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const ripple = useRef<HTMLSpanElement>(null);
  const [stage, setStage] = useState<Stage>("done");
  const [typed, setTyped] = useState(LETTER_COUNT);
  const intro = useTune((t) => t.intro);
  const run = useTune((t) => t.run);

  // Decide whether the intro plays: first load (the inline script already hid the name) or a replay.
  useEffect(() => {
    if (intro !== "pending") return;
    const root = document.documentElement;
    const firstLoad = run === 0;
    const shouldPlay = !reduce && (firstLoad ? root.classList.contains("intro") : true);
    if (!shouldPlay) {
      root.classList.remove("intro");
      tune.set({ ...(firstLoad ? FINAL : {}), panel: "closed", intro: "done" });
      return;
    }
    root.classList.add("intro");
    tune.set({ ...START, panel: "hidden", intro: "playing" });
  }, [intro, run, reduce]);

  // The scripted intro: a ghost cursor sets the name, then tunes it with the real panel.
  useEffect(() => {
    if (intro !== "playing") return;
    const el = cursor.current;
    const heading = h1.current;
    if (!el || !heading) return;

    let cancelled = false;
    let raf = 0;
    const timers = new Set<number>();
    const pos = { x: -60, y: window.innerHeight * 0.75 };
    const place = () => {
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    };
    place();

    const check = () => {
      if (cancelled) throw new Cancelled();
    };
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      }).then(check);
    const tween = (ms: number, onUpdate: (t: number) => void) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const step = (now: number) => {
          if (cancelled) return resolve();
          const t = Math.min(1, (now - start) / ms);
          onUpdate(ease(t));
          if (t < 1) raf = requestAnimationFrame(step);
          else resolve();
        };
        raf = requestAnimationFrame(step);
      }).then(check);
    const moveTo = (x: number, y: number, ms = 600) => {
      const from = { ...pos };
      return tween(ms, (t) => {
        pos.x = from.x + (x - from.x) * t;
        pos.y = from.y + (y - from.y) * t;
        place();
      });
    };
    const center = (target: Element) => {
      const r = target.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2] as const;
    };
    const click = async () => {
      el.animate([{ scale: 1 }, { scale: 0.8 }, { scale: 1 }], { duration: 220, easing: "ease-out" });
      ripple.current?.animate(
        [
          { opacity: 0.7, transform: "translate(-50%, -50%) scale(0.2)" },
          { opacity: 0, transform: "translate(-50%, -50%) scale(1.6)" },
        ],
        { duration: 450, easing: "ease-out" },
      );
      await wait(160);
    };
    const drag = async (id: "wght" | "wdth", to: number, ms: number) => {
      const thumb = document.querySelector(`[data-tune-thumb="${id}"]`);
      if (!thumb) return;
      const [x, y] = center(thumb);
      await moveTo(x, y, 450);
      el.animate([{ scale: 1 }, { scale: 0.88 }], { duration: 120, fill: "forwards" });
      const from = tune.get()[id];
      await tween(ms, (t) => {
        tune.set({ [id]: from + (to - from) * t });
        const [cx, cy] = center(thumb);
        pos.x = cx;
        pos.y = cy;
        place();
      });
      el.animate([{ scale: 0.88 }, { scale: 1 }], { duration: 120, fill: "forwards" });
    };

    const script = async () => {
      setTyped(0);
      setStage("grid");
      await wait(650);
      setStage("type");
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "forwards" });
      const nameBox = heading.getBoundingClientRect();
      await moveTo(nameBox.left + 6, nameBox.top + nameBox.height * 0.22, 600);
      await click();
      for (let i = 1; i <= LETTER_COUNT; i++) {
        setTyped(i);
        await wait(i === NAME[0].length ? 140 : 45 + Math.random() * 30);
      }
      await wait(200);
      setStage("select");
      await wait(250);
      tune.set({ panel: "open" });
      setStage("tune");
      await wait(400);
      await drag("wght", 800, 750);
      await wait(120);
      await drag("wght", FINAL.wght, 350);
      await wait(150);
      await drag("wdth", FINAL.wdth, 600);
      await wait(150);
      const swatch = document.querySelector(`[data-tune-accent="${FINAL.accent}"]`);
      if (swatch) {
        const [x, y] = center(swatch);
        await moveTo(x, y, 400);
        await click();
        tune.set({ accent: FINAL.accent });
      }
      await wait(300);
      setStage("handoff");
      const box = heading.getBoundingClientRect();
      await moveTo(box.left + box.width * 0.62, box.top + box.height * 0.55, 650);
      await wait(800);
      finish();
    };

    const finish = () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach((id) => clearTimeout(id));
      el.getAnimations().forEach((a) => a.cancel());
      el.style.opacity = "0";
      setTyped(LETTER_COUNT);
      setStage("done");
      document.documentElement.classList.remove("intro");
      const t = tune.get();
      // Keep anything the visitor already changed; only fill in what the script did not reach.
      tune.set({
        wght: t.wght === START.wght ? FINAL.wght : t.wght,
        wdth: t.wdth === START.wdth ? FINAL.wdth : t.wdth,
        accent: t.accent === "neutral" ? FINAL.accent : t.accent,
        panel: "closed",
        intro: "done",
      });
    };

    const skip = (e: Event) => {
      if (e instanceof KeyboardEvent && ["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
      finish();
    };
    const events = ["pointerdown", "wheel", "touchstart", "keydown"] as const;
    // Defer so the click that triggered a replay does not also skip it.
    const arm = window.setTimeout(() => events.forEach((n) => window.addEventListener(n, skip, { passive: true })), 50);

    script().catch((err) => {
      if (!(err instanceof Cancelled)) throw err;
    });

    return () => {
      cancelled = true;
      clearTimeout(arm);
      cancelAnimationFrame(raf);
      timers.forEach((id) => clearTimeout(id));
      events.forEach((n) => window.removeEventListener(n, skip));
    };
  }, [intro, run]);

  // Letters follow the tuned weight and width; once the intro is over they swing to the
  // opposite end of each axis near a mouse pointer.
  useEffect(() => {
    const el = h1.current;
    if (!el) return;
    const letters = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-letter]"));
    const current = letters.map(() => 0);
    const pointer = { x: -9999, y: -9999 };
    let frame = 0;
    let visible = true;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      const { wght, wdth, intro: phase } = tune.get();
      const live = phase === "done" && !reduce;
      const wTarget = wght >= 500 ? 200 : 800;
      const dTarget = wdth <= 88 ? 100 : 75;
      letters.forEach((l, i) => {
        let target = 0;
        if (live) {
          const r = l.getBoundingClientRect();
          const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2));
          target = Math.pow(Math.max(0, 1 - d / 280), 1.4);
        }
        current[i] += (target - current[i]) * 0.14;
        const t = current[i];
        l.style.fontVariationSettings = `"wght" ${(wght + (wTarget - wght) * t).toFixed(0)}, "wdth" ${(wdth + (dTarget - wdth) * t).toFixed(1)}`;
      });
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  const scripted = stage !== "done";
  let index = 0;

  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-28 pb-24 sm:pt-40 sm:pb-32">
      <AnimatePresence>
        {scripted && stage !== "handoff" && (
          <motion.div
            key="grid"
            aria-hidden
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="pointer-events-none absolute inset-y-0 inset-x-6 grid grid-cols-6 gap-4 sm:grid-cols-12 sm:gap-6"
          >
            {Array.from({ length: COLUMNS }, (_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.15 + i * 0.045, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                className={`origin-top bg-iris/[0.06] ${i >= 6 ? "hidden sm:block" : ""}`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {scripted && (
        <button
          type="button"
          className="absolute top-14 right-6 z-10 text-sm text-fog underline decoration-line underline-offset-4 hover:text-bone sm:top-24"
        >
          Skip intro
        </button>
      )}

      <div className="relative">
        <AnimatePresence>
          {(stage === "select" || stage === "tune") && <Selection />}
        </AnimatePresence>
        <h1
          ref={h1}
          aria-label="Emilio Hurtado"
          className="relative font-display text-[clamp(4.25rem,19vw,12.5rem)] leading-[0.86] tracking-[-0.035em]"
        >
          {NAME.map((word) => (
            <span key={word} aria-hidden className="relative block">
              {stage === "type" && typed === 0 && index === 0 && <Caret />}
              {word.split("").map((ch) => {
                const i = index++;
                return (
                  <span key={`${word}-${i}`} className="relative inline-block">
                    <span
                      data-letter
                      className="inline-block"
                      style={{
                        fontVariationSettings: `"wght" ${FINAL.wght}, "wdth" ${FINAL.wdth}`,
                        opacity: scripted ? (i < typed ? 1 : 0) : undefined,
                      }}
                    >
                      {ch}
                    </span>
                    {stage === "type" && typed > 0 && i === typed - 1 && <Caret after />}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>
      </div>

      <div data-intro-hide className="mt-12 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <p className="max-w-[34rem] text-xl leading-relaxed text-bone/90">
          Front-end and design engineer in Córdoba, Argentina. I build product interfaces in React, Next.js and
          TypeScript, and I care about the parts people feel: type, spacing, motion and the moment after a click.
        </p>
        <p className="hidden text-sm text-fog [@media(hover:hover)]:block">Move your cursor over my name.</p>
      </div>

      <div
        ref={cursor}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[60] opacity-0"
        style={{ transform: "translate3d(-60px, 0, 0)" }}
      >
        <span ref={ripple} className="absolute top-0 left-0 size-10 rounded-full border-2 border-iris opacity-0" />
        <svg width="22" height="24" viewBox="0 0 22 24" className="-translate-x-[3px] -translate-y-[2px] drop-shadow">
          <path d="M3 2 L3 19 L7.6 14.8 L10.6 21.6 L13.6 20.3 L10.7 13.6 L17 13.6 Z" fill="var(--color-bone)" stroke="var(--color-graphite)" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <AnimatePresence>
          {stage === "handoff" ? (
            <motion.span
              key="turn"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-5 left-4 rounded-full bg-bone px-2.5 py-1 text-xs whitespace-nowrap text-graphite"
            >
              Your turn
            </motion.span>
          ) : (
            <motion.span
              key="name"
              exit={{ opacity: 0 }}
              className="absolute top-5 left-4 rounded-full bg-iris px-2.5 py-1 text-xs whitespace-nowrap text-graphite"
            >
              Emilio
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Caret({ after = false }: { after?: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute top-[0.12em] h-[0.78em] w-[0.05em] animate-pulse bg-iris ${after ? "-right-[0.04em]" : "left-0"}`}
    />
  );
}

function Selection() {
  const wght = useTune((t) => t.wght);
  const wdth = useTune((t) => t.wdth);
  const handles = ["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"];
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="pointer-events-none absolute -inset-x-3 -inset-y-2 border border-iris"
    >
      {handles.map((h) => (
        <span key={h} className={`absolute size-2 border border-iris bg-graphite ${h}`} />
      ))}
      <span className="absolute -top-7 left-0 rounded bg-iris px-1.5 py-0.5 text-xs tabular-nums text-graphite">
        Bricolage Grotesque, weight {Math.round(wght)}, width {Math.round(wdth)}%
      </span>
    </motion.div>
  );
}
