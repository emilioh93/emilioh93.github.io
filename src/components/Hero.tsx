"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

const NAME = ["Emilio", "Hurtado"];

// Each letter's weight and width follow the pointer: close letters get heavy and wide.
export function Hero() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const letters = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-letter]"));
    let frame = 0;

    const reset = () => {
      for (const l of letters) l.style.fontVariationSettings = `"wght" 200, "wdth" 100`;
    };

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        for (const l of letters) {
          const r = l.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const d = Math.hypot(dx, dy);
          const t = Math.pow(Math.max(0, 1 - d / 300), 1.4);
          const wght = 200 + t * 600;
          const wdth = 100 - t * 25;
          l.style.fontVariationSettings = `"wght" ${wght.toFixed(0)}, "wdth" ${wdth.toFixed(1)}`;
        }
      });
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", reset);
    };
  }, [reduce]);

  let i = 0;
  return (
    <section className="mx-auto max-w-6xl px-6 pt-28 pb-24 sm:pt-40 sm:pb-32">
      <h1
        ref={ref}
        aria-label="Emilio Hurtado"
        className="font-display text-[clamp(4.25rem,19vw,12.5rem)] leading-[0.86] tracking-[-0.035em]"
      >
        {NAME.map((word) => (
          <span key={word} aria-hidden className="block">
            {word.split("").map((ch) => {
              const delay = i++ * 0.035;
              return (
                <motion.span
                  key={`${word}-${delay}`}
                  data-letter
                  className="inline-block transition-[font-variation-settings] duration-300 ease-out"
                  style={{ fontVariationSettings: `"wght" 200, "wdth" 100` }}
                  initial={reduce ? false : { opacity: 0, y: "0.25em" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        ))}
      </h1>
      <div className="mt-12 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <p className="max-w-[34rem] text-xl leading-relaxed text-bone/90">
          Front-end and design engineer in Córdoba, Argentina. I build product
          interfaces in React, Next.js and TypeScript, and I care about the
          parts people feel: type, spacing, motion and the moment after a click.
        </p>
        <p className="hidden text-sm text-fog [@media(hover:hover)]:block">Move your cursor over my name.</p>
      </div>
    </section>
  );
}
