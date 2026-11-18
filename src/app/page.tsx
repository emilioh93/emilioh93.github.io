import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { PrevendeReveal } from "@/components/PrevendeReveal";
import { Demo } from "@/components/Demo";
import { Listero } from "@/components/Listero";
import { Experience } from "@/components/Experience";
import { ContactTitle } from "@/components/ContactTitle";

export default function Home() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 pt-5 text-sm text-white mix-blend-difference sm:px-8">
        <a href="#top" className="whitespace-nowrap">
          Emilio Hurtado
        </a>
        <nav aria-label="Sections" className="hidden gap-6 sm:flex">
          <a href="#work" className="opacity-70 hover:opacity-100">
            Work
          </a>
          <a href="#experience" className="opacity-70 hover:opacity-100">
            Experience
          </a>
          <a href="#contact" className="opacity-70 hover:opacity-100">
            Contact
          </a>
        </nav>
      </header>
      <main id="top">
        <Hero />
        <Manifesto />
        <PrevendeReveal />
        <Demo />
        <Listero />
        <Experience />
        <section
          id="contact"
          aria-labelledby="contact-title"
          className="bg-sun px-5 pt-32 pb-10 text-ink sm:px-8"
        >
          <ContactTitle />
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-lg">
            <a
              href="mailto:emiliohurtado1@gmail.com"
              className="underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
            >
              emiliohurtado1@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/emiliohurtado/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
            >
              LinkedIn
            </a>
          </div>
          <p className="mt-24 text-sm text-ink/70">
            Córdoba, Argentina. Working in English with teams in US time zones.
          </p>
        </section>
      </main>
    </>
  );
}
