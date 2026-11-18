"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

// Desktop shot settles from a slight tilt while the phone slides up past it, tied to scroll.
export function WorkShots() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [140, 0]);
  const phoneOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);

  return (
    <div ref={ref} className="relative [perspective:1400px]">
      <motion.div style={reduce ? undefined : { rotateX, scale, transformOrigin: "50% 100%" }}>
        <Image
          src="/work/panel-pedidos.webp"
          alt="Prevendé orders panel on desktop, listing pre-orders with their status and estimated delivery dates"
          width={1600}
          height={923}
          className="w-full rounded-xl border border-line"
          priority
        />
      </motion.div>
      <motion.div
        style={reduce ? undefined : { y: phoneY, opacity: phoneOpacity }}
        className="absolute -right-3 -bottom-10 hidden w-[22%] sm:block"
      >
        <Image
          src="/work/panel-producto-mobile.webp"
          alt="Prevendé product settings on mobile"
          width={750}
          height={1614}
          className="w-full rounded-[1.4rem] border-4 border-graphite shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)]"
        />
      </motion.div>
    </div>
  );
}
