import { LiveDemo } from "./LiveDemo";

export function Demo() {
  return (
    <section
      aria-label="Prevendé live demo"
      className="mx-auto grid max-w-6xl gap-12 px-6 py-28 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16"
    >
      <div>
        <p
          className="font-display text-4xl leading-tight"
          style={{ fontVariationSettings: `"wght" 600, "wdth" 85` }}
        >
          Don&apos;t take my word for it. Run the store.
        </p>
        <p className="mt-5 text-bone/90">
          Per-variant pre-orders, capacity caps, delivery estimates and emails
          to buyers when stock arrives.
        </p>
        <p className="mt-4 text-sm text-fog">
          Next.js, TypeScript, Tailwind, Supabase
        </p>
        <a
          href="https://prevende.com.ar"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block text-iris underline decoration-iris/40 underline-offset-4 hover:decoration-iris"
        >
          Visit prevende.com.ar
        </a>
      </div>
      <LiveDemo />
    </section>
  );
}
