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

const BASE_URL = "https://portfolio-khaki-ten-24.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Vaibhav Dangaich — AI/ML Developer",
    template: "%s | Vaibhav Dangaich",
  },
  description:
    "AI/ML student at BIT Mesra building LLM agents, knowledge graphs & real-time pipelines. Author of mnex — a cognitive AI coding agent. AI intern at Konect U.",

  keywords: [
    "Vaibhav Dangaich",
    "AI ML developer",
    "LLM engineer",
    "knowledge graphs",
    "Neo4j",
    "LangChain",
    "LangGraph",
    "mnex",
    "cognitive AI agent",
    "BIT Mesra",
    "portfolio",
    "React",
    "Next.js",
    "Python",
    "Kafka",
  ],

  authors: [{ name: "Vaibhav Dangaich", url: "https://github.com/VaibhavDangaich" }],
  creator: "Vaibhav Dangaich",

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Vaibhav Dangaich",
    title: "Vaibhav Dangaich — AI/ML Developer",
    description:
      "AI/ML student at BIT Mesra building LLM agents, knowledge graphs & real-time pipelines. Author of mnex — a cognitive AI coding agent on npm.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Vaibhav Dangaich — AI/ML Developer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Vaibhav Dangaich — AI/ML Developer",
    description:
      "AI/ML student at BIT Mesra. LLM agents, knowledge graphs, real-time pipelines. Author of mnex on npm.",
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
