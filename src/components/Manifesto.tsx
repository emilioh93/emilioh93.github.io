"use client";

import { useRef } from "react";
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const TEXT =
  "I design and build product interfaces. The kind people use every day without thinking about it, because someone already thought about it for them.";

// Pinned while the reader scrolls; each word lights up in turn.
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const words = TEXT.split(" ");

  return (
    <section
      ref={ref}
      aria-label="About"
      className="relative h-[260vh] bg-sun text-ink"
    >
      <div className="sticky top-0 flex h-dvh items-center px-5 sm:px-8">
        <p className="max-w-[22ch] font-display text-[clamp(2.25rem,6.4vw,6.5rem)] leading-[1.02] tracking-[-0.02em]">
          {words.map((w, i) => (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
              static={!!reduce}
            >
              {w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  static: still,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  static: boolean;
}) {
  // Leave the last fifth of the pin for the finished sentence to sit.
  const r: [number, number] = [range[0] * 0.8, range[1] * 0.8];
  const opacity = useTransform(progress, r, [0.14, 1]);
  return (
    <motion.span
      className="inline-block pr-[0.24em]"
      style={{
        fontVariationSettings: `"wght" 620, "wdth" 86`,
        opacity: still ? 1 : opacity,
      }}
    >
      {children}
    </motion.span>
  );
}
