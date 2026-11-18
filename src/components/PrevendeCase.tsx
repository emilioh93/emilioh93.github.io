"use client";

import { motion, useReducedMotion } from "motion/react";

const DECISIONS = [
  {
    title: "Works with any store theme",
    body: "Merchants never touch code. Prevendé uses Tiendanube's official storefront SDK to swap the buy button and show the delivery date, and it re-applies the rules every time the shopper picks another variant.",
  },
  {
    title: "Pre-orders per variant, not per product",
    body: "Only the sold-out sizes open up. While a pre-order runs, Prevendé unlocks the stock of those variants, and it puts it back to zero when the cap fills or the merchant turns the pre-order off.",
  },
  {
    title: "The cap closes itself",
    body: "Paid orders arrive as signed webhooks. A unique index makes retries harmless, so an order is never counted twice, and the sale that fills the cap locks the variant again on its own.",
  },
  {
    title: "Billing that fails gently",
    body: "If a store stops paying, its pre-orders pause and the unlocked stock goes back to zero, but orders already taken stay untouched. Paying again brings everything back without setup.",
  },
  {
    title: "One core, more than one platform",
    body: "Everything specific to Tiendanube sits behind a single adapter. The Shopify version reuses the panel, the emails and the metrics, and only implements install, webhooks and stock.",
  },
  {
    title: "Permissions live in the database",
    body: "Each store only sees its own data because Postgres row-level security says so, with tests for every rule. Store access tokens are encrypted, and the key never touches the database.",
  },
];

export function PrevendeCase() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="case-title" className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2
            id="case-title"
            className="font-display text-4xl leading-tight"
            style={{ fontVariationSettings: `"wght" 600, "wdth" 85` }}
          >
            What the demo doesn&apos;t show
          </h2>
          <p className="mt-5 text-bone/90">
            The decisions behind Prevendé, from the store page to the database.
            I made each of them as the product&apos;s only designer and
            engineer.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/panel-producto-mobile.webp"
            alt="Prevendé panel on a phone, setting up a pre-order with delivery date and cap"
            width={750}
            height={1614}
            loading="lazy"
            className="mt-10 hidden w-56 rounded-[1.75rem] border border-line lg:block"
          />
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {DECISIONS.map((d) => (
            <motion.li
              key={d.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
              className="py-8"
            >
              <div>
                <h3 className="text-xl">{d.title}</h3>
                <p className="mt-2 max-w-[38rem] text-bone/80">{d.body}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
