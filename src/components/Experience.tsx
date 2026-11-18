const ROLES = [
  {
    company: "Brightscout",
    role: "Front-end developer",
    when: "2025 to now",
    text: "Remote, for a US agency. Front-end builds and integrations for 10+ B2B SaaS clients at once, plus an embeddable AI chatbot that answers only from a client's documentation. Proposed a component naming process with the design director to keep inherited sites consistent.",
  },
  {
    company: "Scalar",
    role: "Senior front-end developer",
    when: "2021 to 2025",
    text: "Led the features team on Investors App, a spreadsheet-style valuation platform that investment funds use instead of Excel models. React and Redux on a Python and Django back-end. Also led the firm's first AI agents project.",
  },
];

export function Experience() {
  return (
    <section id="experience" aria-labelledby="exp-title" className="mx-auto max-w-6xl px-6 py-24">
      <h2 id="exp-title" className="font-display text-4xl tracking-tight sm:text-5xl" style={{ fontVariationSettings: `"wght" 520, "wdth" 88` }}>
        Experience
      </h2>
      <ol className="mt-12 border-t border-line">
        {ROLES.map((r) => (
          <li key={r.company} className="grid gap-2 border-b border-line py-8 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-10">
            <p className="text-fog tabular-nums">{r.when}</p>
            <div>
              <p className="text-xl">
                {r.role}, <span className="text-fog">{r.company}</span>
              </p>
              <p className="mt-3 max-w-[40rem] text-bone/85">{r.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
