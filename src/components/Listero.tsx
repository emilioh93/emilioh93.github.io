"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// The product name slides across the screen with the scroll, then the details settle under it.
export function Listero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-55%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="listero-title"
      className="overflow-hidden py-28"
    >
      <div className="mx-auto flex max-w-6xl justify-between px-6 text-lg text-fog">
        <p>Selected work</p>
        <p>02</p>
      </div>
      <motion.p
        aria-hidden
        style={{ x, fontVariationSettings: `"wght" 800, "wdth" 75` }}
        className="mt-6 font-display text-[clamp(7rem,30vw,28rem)] leading-[0.85] tracking-[-0.03em] whitespace-nowrap text-sun"
      >
        Listero Listero
      </motion.p>
      <article className="mx-auto mt-16 grid max-w-6xl gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
        <div className="rounded-xl border border-line bg-slate p-6 sm:p-10">
          <p className="text-sm text-fog">Supplier list, uploaded as PDF</p>
          <table className="mt-4 w-full text-left text-sm tabular-nums">
            <thead className="text-fog">
              <tr>
                <th className="py-2 font-normal">Item</th>
                <th className="py-2 text-right font-normal">Cost</th>
                <th className="py-2 text-right font-normal">
                  Price, 35% margin
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[
                ['Galvanized screw 6 x 1"', 112.4, 151.74],
                ["PVC elbow 40 mm", 389.0, 525.15],
                ["Latex paint, 4 L", 18250.0, 24637.5],
                ['Teflon tape 3/4"', 96.8, 130.68],
              ].map(([name, cost, price]) => (
                <tr key={name as string}>
                  <td className="py-2.5 pr-4">{name}</td>
                  <td className="py-2.5 text-right text-fog">
                    $
                    {(cost as number).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2.5 text-right">
                    $
                    {(price as number).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="lg:pt-4">
          <h3
            id="listero-title"
            className="font-display text-3xl"
            style={{ fontVariationSettings: `"wght" 600, "wdth" 90` }}
          >
            Listero
          </h3>
          <p className="mt-1 text-fog">
            Price-list tool for hardware stores, in validation
          </p>
          <p className="mt-6 max-w-prose text-bone/90">
            Turns supplier price lists (Excel, PDF or a photo) into cost and
            sale price with the store&apos;s margin, ready to import into their
            system. Structured files are parsed without AI; scans and photos go
            through a model.
          </p>
          <p className="mt-4 text-sm text-fog">
            Next.js, TypeScript, Postgres, OpenAI
          </p>
          <a
            href="https://listero.endlinestudio.com"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block text-iris underline decoration-iris/40 underline-offset-4 hover:decoration-iris"
          >
            Try Listero
          </a>
        </div>
      </article>
    </section>
  );
}
