"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { SectionTitle } from "./SectionTitle";

const ROLES = [
  {
    company: "Brightscout",
    role: "Front-end developer",
    when: "2025 to now",
    text: "Remote, for a US agency. Front-end builds and integrations for 10+ B2B SaaS clients at once, some of them above. Proposed a component naming process with the design director to keep inherited sites consistent.",
  },
  {
    company: "Scalar",
    role: "Senior front-end developer",
    when: "2021 to 2025",
    text: "Led the features team on Investors App, a spreadsheet-style valuation platform that investment funds use instead of Excel models: React and Redux on a Python and Django back-end. Also led the firm's first AI agents project, two agents built on AnythingLLM, one for sales follow-up and one that assists with valuations.",
  },
];

export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });

  return (
    <section
      id="experience"
      aria-labelledby="exp-title"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <SectionTitle id="exp-title">Experience</SectionTitle>
      <ol ref={ref} className="relative mt-12 sm:pl-0">
        {/* Timeline rule draws itself as the list scrolls into view. */}
        <motion.span
          aria-hidden
          className="absolute top-0 left-0 h-px w-full origin-left bg-line"
          style={reduce ? undefined : { scaleX: scrollYProgress }}
        />
        {ROLES.map((r, idx) => (
          <motion.li
            key={r.company}
            initial={reduce ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ delay: idx * 0.12, duration: 0.5 }}
            className="grid gap-2 border-b border-line py-8 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-10"
          >
            <p className="text-fog tabular-nums">{r.when}</p>
            <div>
              <p className="text-xl">
                {r.role}, <span className="text-fog">{r.company}</span>
              </p>
              <p className="mt-3 max-w-[40rem] text-bone/85">{r.text}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
