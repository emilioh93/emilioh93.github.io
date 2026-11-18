"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const CLIENTS = [
  {
    name: "BlinkOps",
    url: "https://www.blinkops.com",
    what: "Webflow, GSAP",
    body: "Custom interactions on a Webflow marketing site: a testimonial slider driven by GSAP and SplitText, and a tab system on ScrollTrigger. Also SEO and landing page copy.",
  },
  {
    name: "AirData",
    url: "https://airdata.com",
    what: "Webflow, HubSpot, analytics",
    body: "A multi-language Webflow site for a drone fleet platform. When Firefox tracking protection blocked the HubSpot form, I rebuilt it natively with branching by topic and kept leads flowing to HubSpot. I also present the weekly analytics review.",
  },
  {
    name: "haku",
    url: "https://www.hakuapp.com",
    what: "AI search readiness",
    body: "Part of an audit for an event registration platform: making the site readable by AI agents and answer engines, plus redirects and FAQ content.",
  },
  {
    name: "Kindo",
    url: "https://kindo.ai",
    what: "n8n automation",
    body: "An end-to-end n8n workflow for AI search visibility, alongside Webflow and tag manager work.",
  },
  {
    name: "AI chatbot",
    url: null,
    what: "Mastra",
    body: "An embeddable assistant that answers only from a client's own documentation, installed on their site with one script tag. Built with the team.",
  },
];

// Client work at Brightscout. Rows open on hover or tap; the rest of the list steps back.
export function ClientWork() {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="clients-title"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          id="clients-title"
          className="font-display text-4xl leading-tight"
          style={{ fontVariationSettings: `"wght" 600, "wdth" 85` }}
        >
          Client work at Brightscout
        </h2>
        <p className="max-w-sm text-fog">
          Built as part of a remote team at a US agency, 2025 to now.
        </p>
      </div>
      <ul
        className="mt-10 border-t border-line"
        onMouseLeave={() => setOpen(null)}
      >
        {CLIENTS.map((c, i) => {
          const isOpen = open === i;
          const dim = open !== null && !isOpen;
          return (
            <li
              key={c.name}
              onMouseEnter={() => setOpen(i)}
              className={`border-b border-line transition-opacity duration-300 ${dim ? "opacity-40" : ""}`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-baseline justify-between gap-6 py-6 text-left"
              >
                <span
                  className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-none transition-[font-variation-settings] duration-500"
                  style={{
                    fontVariationSettings: isOpen
                      ? `"wght" 760, "wdth" 78`
                      : `"wght" 300, "wdth" 100`,
                  }}
                >
                  {c.name}
                </span>
                <span className="shrink-0 text-sm text-fog">{c.what}</span>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }
                }
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
                  <p className="max-w-2xl text-bone/85">{c.body}</p>
                  {c.url && (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-sun underline decoration-sun/40 underline-offset-4 hover:decoration-sun"
                    >
                      Visit site
                    </a>
                  )}
                </div>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
