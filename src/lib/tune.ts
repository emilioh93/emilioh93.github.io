"use client";

import { useSyncExternalStore } from "react";

export type Accent = "neutral" | "iris" | "mint" | "amber" | "rose";
export type Theme = "dark" | "paper";
export type Panel = "hidden" | "open" | "closed";
export type Intro = "pending" | "playing" | "done";

export type Tune = {
  wght: number;
  wdth: number;
  accent: Accent;
  theme: Theme;
  panel: Panel;
  intro: Intro;
  run: number;
};

export const FINAL = { wght: 700, wdth: 80, accent: "iris" as Accent };
export const START = { wght: 400, wdth: 100, accent: "neutral" as Accent };

export const ACCENTS: Record<Accent, { dark: string; paper: string; label: string }> = {
  neutral: { dark: "#8a909a", paper: "#6b717b", label: "Default" },
  iris: { dark: "#9aa6ff", paper: "#4652c4", label: "Iris" },
  mint: { dark: "#7fe0c3", paper: "#13785a", label: "Mint" },
  amber: { dark: "#f2c94c", paper: "#946500", label: "Amber" },
  rose: { dark: "#ff8fb1", paper: "#b2305f", label: "Rose" },
};

const THEMES: Record<Theme, Record<string, string>> = {
  dark: { graphite: "#151a21", slate: "#1d232c", line: "#2a313b", bone: "#ebe7df", fog: "#949ba6" },
  paper: { graphite: "#eeeae2", slate: "#e3ded3", line: "#cbc4b6", bone: "#1b2027", fog: "#5b626d" },
};

let state: Tune = { ...FINAL, theme: "dark", panel: "hidden", intro: "pending", run: 0 };
const listeners = new Set<() => void>();

function apply(prev: Tune | null) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!prev || prev.theme !== state.theme) {
    if (prev) {
      root.classList.add("theming");
      window.setTimeout(() => root.classList.remove("theming"), 500);
    }
    for (const [k, v] of Object.entries(THEMES[state.theme])) root.style.setProperty(`--color-${k}`, v);
    root.style.colorScheme = state.theme === "dark" ? "dark" : "light";
  }
  if (!prev || prev.accent !== state.accent || prev.theme !== state.theme) {
    root.style.setProperty("--color-iris", ACCENTS[state.accent][state.theme]);
  }
}

export const tune = {
  get: () => state,
  set(patch: Partial<Tune>) {
    const prev = state;
    state = { ...state, ...patch };
    apply(prev);
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useTune<T>(select: (t: Tune) => T): T {
  return useSyncExternalStore(
    tune.subscribe,
    () => select(state),
    () => select(state),
  );
}
