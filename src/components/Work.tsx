import { SectionTitle } from "./SectionTitle";
import { WorkShots } from "./WorkShots";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-6 py-24">
      <SectionTitle id="work-title">Selected work</SectionTitle>

      <article className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
        <WorkShots />
        <div className="lg:pt-4">
          <h3 className="font-display text-3xl" style={{ fontVariationSettings: `"wght" 600, "wdth" 90` }}>
            Prevendé
          </h3>
          <p className="mt-1 text-fog">Pre-order app for Tiendanube stores, 2026</p>
          <p className="mt-6 max-w-prose text-bone/90">
            Lets online stores keep selling when a product is out of stock: per-variant
            pre-orders, capacity caps, delivery estimates and emails to buyers when
            stock arrives. I designed and built the product, the merchant panel and the
            landing page.
          </p>
          <p className="mt-4 text-sm text-fog">Next.js, TypeScript, Tailwind, Supabase</p>
          <a href="https://prevende.com.ar" target="_blank" rel="noreferrer" className="mt-6 inline-block text-iris underline decoration-iris/40 underline-offset-4 hover:decoration-iris">
            Visit prevende.com.ar
          </a>
        </div>
      </article>

      <article className="mt-24 grid gap-10 border-t border-line pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
        <div className="rounded-xl border border-line bg-slate p-6 sm:p-10">
          <p className="text-sm text-fog">Supplier list, uploaded as PDF</p>
          <table className="mt-4 w-full text-left text-sm tabular-nums">
            <thead className="text-fog">
              <tr>
                <th className="py-2 font-normal">Item</th>
                <th className="py-2 text-right font-normal">Cost</th>
                <th className="py-2 text-right font-normal">Price, 35% margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[
                ["Galvanized screw 6 x 1\"", 112.4, 151.74],
                ["PVC elbow 40 mm", 389.0, 525.15],
                ["Latex paint, 4 L", 18250.0, 24637.5],
                ["Teflon tape 3/4\"", 96.8, 130.68],
              ].map(([name, cost, price]) => (
                <tr key={name as string}>
                  <td className="py-2.5 pr-4">{name}</td>
                  <td className="py-2.5 text-right text-fog">${(cost as number).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                  <td className="py-2.5 text-right">${(price as number).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="lg:pt-4">
          <h3 className="font-display text-3xl" style={{ fontVariationSettings: `"wght" 600, "wdth" 90` }}>
            Listero
          </h3>
          <p className="mt-1 text-fog">Price-list tool for hardware stores, in validation</p>
          <p className="mt-6 max-w-prose text-bone/90">
            Turns supplier price lists (Excel, PDF or a photo) into cost and sale price
            with the store&apos;s margin, ready to import into their system. Structured
            files are parsed without AI; scans and photos go through a model.
          </p>
          <p className="mt-4 text-sm text-fog">Next.js, TypeScript, Postgres, OpenAI</p>
          <a href="https://listero.endlinestudio.com" target="_blank" rel="noreferrer" className="mt-6 inline-block text-iris underline decoration-iris/40 underline-offset-4 hover:decoration-iris">
            Try Listero
          </a>
        </div>
      </article>
    </section>
  );
}
