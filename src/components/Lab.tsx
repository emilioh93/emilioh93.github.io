import { CommandMenu } from "./lab/CommandMenu";
import { RangeChart } from "./lab/RangeChart";
import { CopyField } from "./lab/CopyField";

const PIECES = [
  {
    title: "Command menu",
    note: "Keyboard first. Arrow keys move a highlight that slides between rows; Enter runs and confirms.",
    Demo: CommandMenu,
  },
  {
    title: "Range chart",
    note: "A segmented control with a shared pill. Hover a bar and the total becomes that day.",
    Demo: RangeChart,
  },
  {
    title: "Copy, confirmed in place",
    note: "The feedback lives in the button, so the eye never has to leave it.",
    Demo: CopyField,
  },
];

export function Lab() {
  return (
    <section id="lab" aria-labelledby="lab-title" className="mx-auto max-w-6xl px-6 py-24">
      <h2 id="lab-title" className="font-display text-4xl tracking-tight sm:text-5xl" style={{ fontVariationSettings: `"wght" 520, "wdth" 88` }}>
        Lab
      </h2>
      <p className="mt-4 max-w-[36rem] text-fog">
        Small interface studies. They are live, so try them.
      </p>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3">
        {PIECES.map(({ title, note, Demo }) => (
          <figure key={title} className="flex flex-col bg-slate p-4">
            <div className="relative">
              <Demo />
            </div>
            <figcaption className="border-t border-line px-2 pt-4 pb-2">
              <p className="text-bone">{title}</p>
              <p className="mt-1 text-sm text-fog">{note}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
