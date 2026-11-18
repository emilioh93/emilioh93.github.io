"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Copies my email. The confirmation lives inside the button: the icon morphs and the label settles.
export function CopyField() {
  const [copied, setCopied] = useState(false);
  const value = "emiliohurtado1@gmail.com";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard can be blocked in iframes; the visual state still confirms the action.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex min-h-40 items-center sm:min-h-80 justify-center p-2">
      <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-line bg-graphite py-1.5 pr-1.5 pl-4">
        <span className="flex-1 truncate text-sm text-bone/90">{value}</span>
        <motion.button
          type="button"
          onClick={copy}
          layout
          aria-live="polite"
          className={`flex items-center gap-1.5 overflow-hidden rounded-lg px-3 py-2 text-sm transition-colors ${copied ? "bg-iris text-graphite" : "bg-slate text-bone hover:bg-line"}`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {copied ? (
              <motion.svg
                key="check"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                aria-hidden
              >
                <motion.path
                  d="M3 8.5l3 3 7-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.svg>
            ) : (
              <motion.svg
                key="copy"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                aria-hidden
              >
                <rect x="5" y="5" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 10V4a1 1 0 0 1 1-1h6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </motion.svg>
            )}
          </AnimatePresence>
          <motion.span layout="position">{copied ? "Copied" : "Copy"}</motion.span>
        </motion.button>
      </div>
    </div>
  );
}
