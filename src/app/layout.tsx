import "./globals.css";
import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import Navbar from "@/components/Navbar";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Wuthering_Community — Builds, ecos y comunidad",
  description: "Optimiza tus personajes de Wuthering Waves, consulta sets de ecos y consulta a la comunidad.",
  icons: {
    icon: "/image.png"
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${display.variable}`}>
      <body>
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        <footer className="border-t border-mist py-8 text-center text-xs text-slate2">
          Proyecto Hecho por DarkMaxDev.Wuthering Waves es marca de Kuro Games.
        </footer>
      </body>
    </html>
  );
}
