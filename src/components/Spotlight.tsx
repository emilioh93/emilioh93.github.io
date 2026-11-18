"use client";

import { useRef } from "react";

// A soft light that follows the pointer inside the card. CSS variables keep it off the React render path.
export function Spotlight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
        el.style.setProperty("--o", "1");
      }}
      onPointerLeave={() => ref.current?.style.setProperty("--o", "0")}
      className={`group relative ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: "var(--o, 0)",
          background: "radial-gradient(420px circle at var(--x) var(--y), rgba(154,166,255,0.09), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}
