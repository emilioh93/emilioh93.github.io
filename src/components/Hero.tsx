"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

const NAME = ["Emilio", "Hurtado"];
const IDLE_AFTER_MS = 1800;

// Letters get heavy and condensed near the pointer. With no pointer (touch, or idle),
// a soft wave of weight travels across the name instead.
export function Hero() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const letters = Array.from(
      el.querySelectorAll<HTMLSpanElement>("[data-letter]"),
    );
    const current = letters.map(() => 0);
    const pointer = { x: 0, y: 0, at: -Infinity };
    let frame = 0;
    let visible = true;
    const start = performance.now();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.at = performance.now();
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      const usePointer = now - pointer.at < IDLE_AFTER_MS;
      const rects = letters.map((l) => l.getBoundingClientRect());
      const left = rects[0].left;
      const span = Math.max(...rects.map((r) => r.right)) - left;
      // Wave center sweeps left to right and back, about 7s per round trip.
      const phase = ((now - start) / 7000) * Math.PI * 2;
      const waveX = left + span * (0.5 - 0.5 * Math.cos(phase));

      letters.forEach((l, i) => {
        const r = rects[i];
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const target = usePointer
          ? Math.pow(
              Math.max(0, 1 - Math.hypot(pointer.x - cx, pointer.y - cy) / 300),
              1.4,
            )
          : Math.pow(Math.max(0, 1 - Math.abs(waveX - cx) / (span * 0.22)), 2) *
            0.75;
        current[i] += (target - current[i]) * 0.12;
        const t = current[i];
        l.style.fontVariationSettings = `"wght" ${(200 + t * 600).toFixed(0)}, "wdth" ${(100 - t * 25).toFixed(1)}`;
      });
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);
    window.addEventListener("pointermove", onMove);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce]);

  let i = 0;
  return (
    <section className="relative flex min-h-dvh flex-col justify-between bg-sun px-5 pt-28 pb-6 text-ink sm:px-8">
      <h1
        ref={ref}
        aria-label="Emilio Hurtado"
        className="my-auto font-display text-[clamp(4.5rem,21.5vw,22rem)] sm:my-0 leading-[0.8] tracking-[-0.04em]"
      >
        {NAME.map((word) => (
          <span key={word} aria-hidden className="block">
            {word.split("").map((ch) => {
              const delay = i++ * 0.035;
              return (
                <motion.span
                  key={`${word}-${delay}`}
                  data-letter
                  className="inline-block"
                  style={{ fontVariationSettings: `"wght" 200, "wdth" 100` }}
                  initial={reduce ? false : { opacity: 0, y: "0.25em" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay,
                    duration: 0.7,
                    ease: [0.2, 0.7, 0.2, 1],
                  }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        ))}
      </h1>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <p className="max-w-[26rem] text-lg leading-snug">
          Front-end and design engineer in Córdoba, Argentina. I build product
          interfaces in React, Next.js and TypeScript.
        </p>
        <p className="text-sm text-ink/60" aria-hidden>
          Scroll
        </p>
      </div>
    </section>
  );
}
