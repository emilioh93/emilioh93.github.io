import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Lab } from "@/components/Lab";
import { Experience } from "@/components/Experience";

export default function Home() {
  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-6 text-sm">
        <a href="#top" className="whitespace-nowrap text-bone">Emilio Hurtado</a>
        <nav aria-label="Sections" className="hidden gap-6 text-fog sm:flex">
          <a href="#work" className="hover:text-bone">Work</a>
          <a href="#lab" className="hover:text-bone">Lab</a>
          <a href="#experience" className="hover:text-bone">Experience</a>
          <a href="#contact" className="hover:text-bone">Contact</a>
        </nav>
      </header>
      <main id="top">
        <Hero />
        <Work />
        <Lab />
        <Experience />
        <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl px-6 pt-24 pb-32">
          <h2
            id="contact-title"
            className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tight"
            style={{ fontVariationSettings: `"wght" 380, "wdth" 85` }}
          >
            Building something that should feel good to use?
          </h2>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-lg">
            <a href="mailto:emiliohurtado1@gmail.com" className="text-iris underline decoration-iris/40 underline-offset-4 hover:decoration-iris">
              emiliohurtado1@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/emiliohurtado/" target="_blank" rel="noreferrer" className="text-bone underline decoration-line underline-offset-4 hover:decoration-bone">
              LinkedIn
            </a>
          </div>
          <p className="mt-16 text-sm text-fog">Córdoba, Argentina. Working in English with teams in US time zones.</p>
        </section>
      </main>
    </>
  );
}
