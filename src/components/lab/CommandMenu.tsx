"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Item = { id: string; label: string; group: string; hint?: string };

const ITEMS: Item[] = [
  { id: "new", label: "New pre-order", group: "Actions", hint: "N" },
  { id: "dup", label: "Duplicate product", group: "Actions", hint: "D" },
  { id: "notify", label: "Notify buyers", group: "Actions" },
  { id: "orders", label: "Go to orders", group: "Navigate", hint: "G O" },
  { id: "stock", label: "Go to stock", group: "Navigate", hint: "G S" },
  { id: "settings", label: "Open settings", group: "Navigate", hint: "," },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ITEMS.filter((i) => i.label.toLowerCase().includes(q)) : ITEMS;
  }, [query]);

  // Query and highlight reset on close, so the menu always reopens clean.
  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  const run = (item: Item) => {
    setDone(item.label);
    close();
    window.setTimeout(() => setDone(null), 1800);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      run(results[active]);
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <div className="relative flex min-h-56 flex-col sm:min-h-80 items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-line bg-graphite px-4 py-2 text-sm text-bone transition-colors hover:border-fog"
      >
        Open command menu <kbd className="ml-2 hidden text-fog [@media(hover:hover)]:inline">Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {done && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-iris"
          >
            Ran “{done}”
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 z-10 flex items-start justify-center rounded-2xl bg-graphite/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <motion.div
              role="dialog"
              aria-label="Command menu"
              initial={{ opacity: 0, scale: 0.97, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 38 }}
              className="w-full max-w-sm overflow-hidden rounded-xl border border-line bg-slate shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
            >
              <input
                ref={input}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Type a command"
                aria-label="Search commands"
                className="w-full border-b border-line bg-transparent px-4 py-3 text-base text-bone placeholder:text-fog focus:outline-none"
              />
              <ul role="listbox" className="max-h-64 overflow-y-auto p-1.5">
                {results.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-fog">
                    No command matches “{query}”.
                  </li>
                )}
                {results.map((item, idx) => {
                  const header = idx === 0 || results[idx - 1].group !== item.group ? item.group : null;
                  return (
                    <li key={item.id}>
                      {header && <p className="px-3 pt-2 pb-1 text-xs text-fog">{header}</p>}
                      <button
                        type="button"
                        role="option"
                        aria-selected={idx === active}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => run(item)}
                        className="relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm"
                      >
                        {idx === active && (
                          <motion.span
                            layoutId="cmd-active"
                            className="absolute inset-0 rounded-lg bg-white/[0.06]"
                            transition={{ type: "spring", stiffness: 600, damping: 40 }}
                          />
                        )}
                        <span className="relative">{item.label}</span>
                        {item.hint && <kbd className="relative text-xs text-fog">{item.hint}</kbd>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
