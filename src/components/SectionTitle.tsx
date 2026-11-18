"use client";

import { motion, useReducedMotion } from "motion/react";

// Section titles load their weight letter by letter the first time they enter the viewport.
export function SectionTitle({
  id,
  children,
}: {
  id: string;
  children: string;
}) {
  const reduce = useReducedMotion();
  return (
    <h2
      id={id}
      aria-label={children}
      className="font-display text-4xl tracking-tight sm:text-5xl"
    >
      {children.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          initial={
            reduce
              ? false
              : {
                  fontVariationSettings: `"wght" 200, "wdth" 100`,
                  opacity: 0.25,
                }
          }
          whileInView={{
            fontVariationSettings: `"wght" 520, "wdth" 88`,
            opacity: 1,
          }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            delay: i * 0.03,
            duration: 0.5,
            ease: [0.2, 0.7, 0.2, 1],
          }}
          style={
            reduce
              ? { fontVariationSettings: `"wght" 520, "wdth" 88` }
              : undefined
          }
        >
          {ch}
        </motion.span>
      ))}
    </h2>
  );
}
