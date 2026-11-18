"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const CLIENTS = [
  {
    name: "DatologyAI",
    url: "https://www.datologyai.com",
    what: "Next.js, Payload CMS",
    body: "Built pages of their 2026 site from Figma on Next.js and Payload CMS, including the Labs collection. Upgraded Payload from 3.49 to 3.84 against the production database, added bot protection to the contact form, and set up analytics.",
  },
  {
    name: "Zephon",
    url: "https://www.zephon.io",
    what: "Next.js, launch site",
    body: "The launch site for DatologyAI's training data loader: a static Next.js page with a chart that compares loaders step by step and a terminal that shows the first batch, matched to their real output.",
  },
  {
    name: "Key",
    url: "https://key.co",
    what: "Next.js, auth, search",
    body: "On a vacation home booking site, I fixed Google sign-in on iPhone, where only the edge of the button worked, by moving it to a server-side OAuth redirect. Also search results, pagination and event tracking.",
  },
  {
    name: "Route",
    url: "https://route.com",
    what: "Next.js, Payload CMS",
    body: "Components for their marketing site, like tabbed cards with horizontal scroll and a social proof block, and an inline demo request form. When their ad traffic dropped, I traced every release to rule the site in or out.",
  },
  {
    name: "Motorq",
    url: "https://www.motorq.com",
    what: "Multi-step form, APIs",
    body: "A capability check for fleets: paste or upload vehicle numbers, the form cleans and validates them, then hands off to their API and HubSpot. It ships from its own repo and Webflow loads it with one script. In progress.",
  },
  {
    name: "Baringa",
    url: null,
    what: "AI chatbot, Webflow",
    body: "An AI assistant on their Webflow site that answers from the site's own content. I built the widget's open and close API, so any button can start a chat, and the analytics events behind it.",
  },
  {
    name: "Predibase",
    url: "https://predibase.com",
    what: "Gatsby, privacy, CMS",
    body: "Found trackers that fired before cookie consent and moved them behind the consent manager. Also a model library page fed by their API, and a glossary migrated into Contentful so marketing can edit it.",
  },
  {
    name: "BlinkOps",
    url: "https://www.blinkops.com",
    what: "Webflow, GSAP",
    body: "Custom interactions on a Webflow site: a testimonial slider driven by GSAP and SplitText, and a tab system on ScrollTrigger. Also SEO and landing page copy.",
  },
  {
    name: "AirData",
    url: "https://airdata.com",
    what: "Webflow, HubSpot",
    body: "A multi-language Webflow site for a drone fleet platform. When Firefox tracking protection blocked the HubSpot form, I rebuilt it natively with branching by topic and kept leads flowing to HubSpot.",
  },
  {
    name: "MatrixSpace",
    url: "https://www.matrixspace.com",
    what: "SEO, AI search",
    body: "Technical audit and fixes so search engines and AI answers read the site well: schema, llms.txt, titles and redirects, tracked weekly in Semrush.",
  },
  {
    name: "Kindo",
    url: "https://kindo.ai",
    what: "n8n automation",
    body: "An end-to-end n8n workflow for AI search visibility, alongside Webflow and tag manager work.",
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
