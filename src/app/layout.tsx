import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emilio Hurtado, design engineer",
  description:
    "Senior front-end and design engineer in Córdoba, Argentina. Interfaces in React, Next.js and TypeScript, built with care for type, motion and detail.",
  openGraph: {
    title: "Emilio Hurtado, design engineer",
    description:
      "Interfaces in React, Next.js and TypeScript, built with care for type, motion and detail.",
    url: "https://emilioh93.github.io",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // Hide the name before first paint when the intro is going to play, so it never flashes.
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!location.hash&&scrollY<80)document.documentElement.classList.add('intro')",
          }}
        />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
