"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";

type Status = "confirmed" | "dispatched";
type Order = { id: number; name: string; size: string; status: Status };
type Flight = { id: number; x: number; y: number; dx: number; dy: number; size: string };

const START_STOCK = 2;
const CAPACITY = 5;
const BUYERS = ["Martina G.", "Joaquín F.", "Lucía P.", "Tomás R.", "Valentina S.", "Bruno A.", "Camila D."];
const SIZES = ["S", "M", "L"];
const spring = { type: "spring", stiffness: 420, damping: 34 } as const;

// A working slice of Prevendé: buy until stock runs out, take pre-orders, then dispatch them when stock arrives.
// It plays itself until the visitor touches it.
export function LiveDemo() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [stock, setStock] = useState(START_STOCK);
  const [size, setSize] = useState("M");
  const [orders, setOrders] = useState<Order[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [dispatching, setDispatching] = useState(false);
  const [added, setAdded] = useState(0);
  const [touched, setTouched] = useState(false);
  const [visible, setVisible] = useState(false);
  const nextId = useRef(1041);
  const buyer = useRef(0);
  const timers = useRef<number[]>([]);

  const inFlight = flights.length;
  const pending = orders.length + inFlight;
  const mode = stock > 0 ? "stock" : pending >= CAPACITY ? "full" : "preorder";
  const confirmed = orders.filter((o) => o.status === "confirmed").length;

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const primary = useCallback(() => {
    if (dispatching) return;
    if (stock > 0) {
      setStock((s) => s - 1);
      setAdded((a) => a + 1);
      return;
    }
    if (pending >= CAPACITY) return;
    const order: Order = {
      id: nextId.current++,
      name: BUYERS[buyer.current++ % BUYERS.length],
      size,
      status: "confirmed",
    };
    const from = button.current?.getBoundingClientRect();
    const to = list.current?.getBoundingClientRect();
    if (reduce || !from || !to) {
      setOrders((o) => [order, ...o]);
      return;
    }
    const flight = {
      id: order.id,
      x: from.left + from.width / 2 - 70,
      y: from.top,
      dx: to.left + 24 - (from.left + from.width / 2 - 70),
      dy: to.top + 8 - from.top,
      size,
    };
    setFlights((f) => [...f, flight]);
    later(() => {
      setFlights((f) => f.filter((x) => x.id !== flight.id));
      setOrders((o) => [order, ...o]);
    }, 720);
  }, [dispatching, stock, pending, size, reduce]);

  const stockArrived = useCallback(() => {
    if (dispatching || confirmed === 0 || inFlight) return;
    setDispatching(true);
    const ids = orders.filter((o) => o.status === "confirmed").map((o) => o.id).reverse();
    ids.forEach((id, i) =>
      later(() => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: "dispatched" } : o))), 450 + i * 420),
    );
    const done = 450 + ids.length * 420 + 1300;
    later(() => setOrders([]), done);
    later(() => {
      setStock(START_STOCK);
      setAdded(0);
      setDispatching(false);
    }, done + 450);
  }, [dispatching, confirmed, inFlight, orders]);

  // Autoplay: one step at a time while on screen, until the visitor takes over.
  useEffect(() => {
    if (touched || reduce || !visible || dispatching) return;
    const id = window.setTimeout(() => {
      if (stock > 0 || orders.length + inFlight < 3) primary();
      else stockArrived();
    }, stock === START_STOCK && orders.length === 0 ? 1600 : 1250);
    return () => clearTimeout(id);
  }, [touched, reduce, visible, dispatching, stock, orders.length, inFlight, primary, stockArrived]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const t = timers.current;
    return () => {
      io.disconnect();
      t.forEach(clearTimeout);
    };
  }, []);

  return (
    <div ref={root} onPointerDownCapture={() => setTouched(true)} onKeyDownCapture={() => setTouched(true)}>
      <LayoutGroup>
        <div className="relative grid gap-4 sm:grid-cols-[15rem_1fr] sm:items-start">
          {/* Storefront */}
          <div className="rounded-2xl border border-line bg-slate p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]">
            <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl bg-graphite">
              <Tee />
              <AnimatePresence>
                {mode !== "stock" && (
                  <motion.span
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-2.5 left-2.5 rounded-full bg-iris px-2 py-0.5 text-xs text-graphite"
                  >
                    Pre-order
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-bone">Oversize tee</p>
              <p className="text-sm text-bone tabular-nums">$24.900</p>
            </div>
            <div className="mt-1 flex h-5 items-center gap-1 overflow-hidden text-sm text-fog">
              {mode === "stock" ? (
                <>
                  <span className="relative inline-flex w-[1ch] justify-center tabular-nums text-bone">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={stock}
                        initial={{ y: "-100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={spring}
                      >
                        {stock}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  left in stock
                </>
              ) : (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Out of stock, ships Dec 12
                </motion.span>
              )}
            </div>
            <div role="radiogroup" aria-label="Size" className="mt-3 flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={size === s}
                  onClick={() => setSize(s)}
                  className={`relative h-8 flex-1 rounded-lg border text-sm ${size === s ? "border-bone text-bone" : "border-line text-fog hover:text-bone"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <motion.button
              ref={button}
              layout
              type="button"
              onClick={primary}
              disabled={mode === "full" || dispatching}
              transition={spring}
              style={{ borderRadius: 10 }}
              className={`relative mt-3 grid h-11 w-full place-items-center overflow-hidden text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                mode === "stock" ? "bg-bone text-graphite" : mode === "preorder" ? "bg-iris text-graphite" : "bg-line text-fog"
              }`}
            >
              <AnimatePresence initial={false}>
                <motion.span
                  key={mode === "stock" ? `stock-${added}` : mode}
                  className="col-start-1 row-start-1"
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={spring}
                >
                  {mode === "stock"
                    ? added > 0
                      ? "Added, buy another"
                      : "Add to cart"
                    : mode === "preorder"
                      ? "Pre-order now"
                      : "Pre-orders are full"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Merchant panel */}
          <div className="rounded-2xl border border-line bg-slate p-4 sm:mt-10">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-bone">Pre-orders</p>
              <p className="text-sm tabular-nums text-fog">
                <span className="text-bone">{orders.length}</span> of {CAPACITY}
              </p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full origin-left rounded-full bg-iris"
                animate={{ scaleX: orders.length / CAPACITY }}
                transition={spring}
              />
            </div>
            <div ref={list} className="relative mt-4 min-h-[9rem] sm:min-h-[13.5rem]">
              <AnimatePresence initial={false}>
                {orders.length === 0 && (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    className="absolute inset-x-0 top-8 text-center text-sm text-fog"
                  >
                    When the tee sells out, pre-orders land here.
                  </motion.p>
                )}
              </AnimatePresence>
              <ul className="space-y-2">
                <AnimatePresence initial={false}>
                  {orders.map((o) => (
                    <motion.li
                      key={o.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, x: 24, transition: { duration: 0.25 } }}
                      transition={spring}
                      className="relative flex items-center justify-between rounded-lg border border-line bg-graphite px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-bone">
                          #{o.id} <span className="text-fog">{o.name}</span>
                        </p>
                        <p className="text-xs text-fog">
                          Size {o.size}
                          {o.status === "dispatched" && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              , email sent
                            </motion.span>
                          )}
                        </p>
                      </div>
                      <Badge status={o.status} />
                      {o.status === "dispatched" && !reduce && <Envelope />}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
            <button
              type="button"
              onClick={stockArrived}
              disabled={dispatching || confirmed === 0 || inFlight > 0}
              className="mt-3 h-10 w-full rounded-[10px] border border-line text-sm text-bone hover:border-fog disabled:cursor-not-allowed disabled:text-fog disabled:hover:border-line"
            >
              {dispatching ? "Dispatching…" : "Stock arrived, dispatch all"}
            </button>
          </div>
        </div>
      </LayoutGroup>

      {flights.map((f) => (
        <motion.div
          key={f.id}
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-50 w-[140px] rounded-lg border border-iris bg-graphite px-3 py-2 text-xs text-bone shadow-lg"
          initial={{ x: f.x, y: f.y, scale: 0.9, opacity: 0 }}
          animate={{
            x: [f.x, f.x + f.dx * 0.5, f.x + f.dx],
            y: [f.y, f.y + Math.min(f.dy, 0) - 70, f.y + f.dy],
            scale: [0.9, 1.05, 0.9],
            opacity: [0, 1, 0.9],
          }}
          transition={{ duration: 0.72, ease: [0.4, 0, 0.2, 1], times: [0, 0.45, 1] }}
        >
          #{f.id}, size {f.size}
        </motion.div>
      ))}

      <p className="mt-5 text-sm text-fog">
        {touched ? "It’s yours. Sell it out, take pre-orders, then dispatch." : "A working slice of Prevendé, my pre-order app for Tiendanube stores. Click anything to take over."}
      </p>
    </div>
  );
}

function Badge({ status }: { status: Status }) {
  return (
    <span className="relative ml-3 grid shrink-0 overflow-hidden rounded-full text-xs">
      <AnimatePresence initial={false}>
        <motion.span
          key={status}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={spring}
          className={`col-start-1 row-start-1 px-2 py-0.5 text-center ${status === "confirmed" ? "bg-iris/15 text-iris" : "bg-bone/10 text-bone"}`}
        >
          {status === "confirmed" ? "Confirmed" : "Dispatched"}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Envelope() {
  return (
    <motion.svg
      aria-hidden
      width="18"
      height="14"
      viewBox="0 0 18 14"
      className="pointer-events-none absolute top-1 right-6 text-iris"
      initial={{ opacity: 0, y: 4, x: 0, rotate: 0 }}
      animate={{ opacity: [0, 1, 0], y: -34, x: 26, rotate: 12 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <rect x="1" y="1" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 2 L9 8 L16.5 2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </motion.svg>
  );
}

function Tee() {
  return (
    <svg viewBox="0 0 120 100" className="w-[58%] text-bone" aria-label="Oversize tee">
      <path
        d="M40 12 C46 18 74 18 80 12 L104 24 L96 44 L86 40 L86 92 L34 92 L34 40 L24 44 L16 24 Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path d="M46 14 C52 22 68 22 74 14" fill="none" stroke="var(--color-graphite)" strokeWidth="2" opacity="0.35" />
    </svg>
  );
}
