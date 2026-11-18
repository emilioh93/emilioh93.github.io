"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Data-dense control: a segmented range switch that re-flows a bar chart.
const DATA: Record<string, number[]> = {
  "7D": [42, 58, 51, 66, 73, 61, 80],
  "30D": [30, 44, 39, 52, 61, 48, 70, 66, 75, 58, 82, 77, 90, 85],
  "90D": [20, 26, 31, 29, 38, 44, 41, 50, 57, 54, 63, 69, 66, 74, 81, 78, 88, 92],
};
const RANGES = Object.keys(DATA);

export function RangeChart() {
  const [range, setRange] = useState("30D");
  const [hover, setHover] = useState<number | null>(null);
  const values = DATA[range];
  const max = Math.max(...values);
  const total = values.reduce((a, b) => a + b, 0);
  const shown = hover !== null ? values[hover] : total;

  return (
    <div className="flex min-h-80 flex-col justify-between gap-6 p-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-fog">{hover !== null ? `Day ${hover + 1}` : `Pre-orders, last ${range}`}</p>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={`${range}-${hover}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="font-display text-4xl tabular-nums"
              style={{ fontVariationSettings: `"wght" 600, "wdth" 85` }}
            >
              {shown.toLocaleString("en-US")}
            </motion.p>
          </AnimatePresence>
        </div>
        <div role="tablist" aria-label="Range" className="flex rounded-full border border-line p-0.5 text-xs">
          {RANGES.map((r) => (
            <button
              key={r}
              role="tab"
              type="button"
              aria-selected={r === range}
              onClick={() => {
                setRange(r);
                setHover(null);
              }}
              className={`relative rounded-full px-3 py-1.5 transition-colors ${r === range ? "text-graphite" : "text-fog hover:text-bone"}`}
            >
              {r === range && (
                <motion.span
                  layoutId="range-pill"
                  className="absolute inset-0 rounded-full bg-bone"
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                />
              )}
              <span className="relative">{r}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-40 items-end gap-1" onMouseLeave={() => setHover(null)}>
        {values.map((v, i) => (
          <motion.button
            key={`${range}-${i}`}
            type="button"
            aria-label={`Day ${i + 1}: ${v}`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.02, type: "spring", stiffness: 300, damping: 30 }}
            style={{ height: `${(v / max) * 100}%`, transformOrigin: "bottom" }}
            className={`flex-1 rounded-t-[3px] transition-colors ${hover === null || hover === i ? "bg-iris" : "bg-iris/25"}`}
          />
        ))}
      </div>
    </div>
  );
}
