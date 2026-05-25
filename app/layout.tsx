import type { Metadata } from "next";
import {
  Caveat,
  Instrument_Serif,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vaibhav Dangaich — Portfolio",
  description:
    "AI/ML student at BIT Mesra. LLMs, knowledge graphs, real-time pipelines. Currently interning at Konect U.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = [
    spaceGrotesk.variable,
    instrumentSerif.variable,
    jetbrains.variable,
    caveat.variable,
  ].join(" ");

  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
