"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const WORD = "Prevendé";
const MAX_SCALE = 45;

// The product name is a window cut out of the yellow page. Scrolling dives through the stem of
// the "P" until the product fills the screen.
export function PrevendeReveal() {
  const ref = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const group = useRef<SVGGElement>(null);
  const cover = useRef<SVGRectElement>(null);
  const fsRef = useRef(360);
  const measure = useRef<SVGTextElement>(null);
  const reduce = useReducedMotion();
  const [box, setBox] = useState({ w: 1600, h: 900, fs: 360 });
  const origin = useRef({ x: 800, y: 450 });
  const [fontsReady, setFontsReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 0.8], [1.25, 1]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.78, 0.92], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.78, 0.92], [24, 0]);

  function applyScale(p: number) {
    const g = group.current;
    if (!g) return;
    const t = Math.min(1, Math.max(0, (p - 0.12) / 0.66));
    const s = Math.pow(MAX_SCALE, t * t);
    const { x, y } = origin.current;
    g.setAttribute(
      "transform",
      `translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`,
    );
    // Past roughly 8000px of rendered font size the glyphs vanish, so fade the cover out first.
    const size = s * fsRef.current;
    const fade = Math.min(1 - (size - 4500) / 3000, (1 - t) / 0.12);
    cover.current?.setAttribute(
      "opacity",
      String(Math.min(1, Math.max(0, fade))),
    );
  }

  // Track the screen size; the word is then fitted to it and the dive point found inside the "P".
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setBox((b) => ({
        ...b,
        w: Math.max(1, r.width),
        h: Math.max(1, r.height),
      }));
    };
    update();
    document.fonts.ready.then(() => setFontsReady(true));
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const t = measure.current;
    if (!t || !fontsReady) return;
    const bw = t.getBBox().width;
    if (!bw) return;
    const fs = Math.min(box.h * 0.42, box.fs * ((box.w * 0.92) / bw));
    if (Math.abs(fs - box.fs) / box.fs > 0.01) {
      setBox((b) => ({ ...b, fs }));
      return;
    }
    const p = t.getExtentOfChar(0);
    const bb = t.getBBox();
    // Left stem of the "P": just inside the left edge of its glyph, at mid cap height.
    fsRef.current = box.fs;
    origin.current = { x: p.x + box.fs * 0.09, y: bb.y + bb.height * 0.5 };
    applyScale(scrollYProgress.get());
  }, [box, fontsReady, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (p) => applyScale(p));

  const textProps = {
    x: box.w / 2,
    y: box.h / 2 + box.fs * 0.34,
    textAnchor: "middle" as const,
    fontSize: box.fs,
    className: "font-display",
    style: {
      fontVariationSettings: `"wght" 800, "wdth" 75`,
      letterSpacing: "-0.02em",
    },
  };

  if (reduce) {
    return (
      <section id="work" aria-labelledby="prevende-title" className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/panel-pedidos.webp"
          alt="Prevendé merchant panel with the pre-order list"
          className="w-full"
        />
        <Caption />
      </section>
    );
  }

  return (
    <section
      id="work"
      ref={ref}
      aria-labelledby="prevende-title"
      className="relative h-[320vh] bg-sun"
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <motion.img
          src="/work/panel-pedidos.webp"
          alt="Prevendé merchant panel with the pre-order list"
          className="absolute inset-0 h-full w-full object-cover object-left-top"
          style={{ scale: imgScale }}
        />
        <svg
          ref={svg}
          aria-hidden
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${box.w} ${box.h}`}
        >
          <defs>
            <mask
              id="prevende-cut"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={box.w}
              height={box.h}
            >
              <rect width={box.w} height={box.h} fill="white" />
              <g ref={group}>
                <text {...textProps} fill="black">
                  {WORD}
                </text>
              </g>
            </mask>
          </defs>
          <rect
            width={box.w}
            height={box.h}
            ref={cover}
            className="fill-sun"
            mask="url(#prevende-cut)"
          />
          <text ref={measure} {...textProps} fill="transparent">
            {WORD}
          </text>
        </svg>
        <motion.div
          style={{ opacity: introOpacity }}
          className="absolute inset-x-5 top-24 flex justify-between text-ink sm:inset-x-8"
        >
          <p className="text-lg">Selected work</p>
          <p className="text-lg">01</p>
        </motion.div>
        <motion.div
          style={{ opacity: captionOpacity, y: captionY }}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-graphite via-graphite/90 to-transparent pt-32"
        >
          <Caption />
        </motion.div>
      </div>
    </section>
  );
}

function Caption() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-10">
      <h2
        id="prevende-title"
        className="font-display text-5xl sm:text-6xl"
        style={{ fontVariationSettings: `"wght" 700, "wdth" 80` }}
      >
        Prevendé
      </h2>
      <p className="mt-3 max-w-xl text-lg text-bone/90">
        Pre-order app for Tiendanube stores, 2026. I designed and built the
        product, the merchant panel and the landing page.
      </p>
    </div>
  );
}
