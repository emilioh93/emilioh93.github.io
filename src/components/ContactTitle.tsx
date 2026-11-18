"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

// The closing line gains weight as the reader reaches the end of the page.
export function ContactTitle() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end 70%"],
  });
  const settings = useTransform(scrollYProgress, (p) => {
    const t = Math.min(1, Math.max(0, p));
    return `"wght" ${(200 + t * 500).toFixed(0)}, "wdth" ${(100 - t * 18).toFixed(1)}`;
  });

  return (
    <motion.h2
      ref={ref}
      id="contact-title"
      className="font-display max-w-[16ch] text-[clamp(3rem,10vw,10rem)] leading-[0.9] tracking-[-0.03em]"
      style={{
        fontVariationSettings: reduce ? `"wght" 500, "wdth" 85` : settings,
      }}
    >
      Building something that should feel good to use?
    </motion.h2>
  );
}
