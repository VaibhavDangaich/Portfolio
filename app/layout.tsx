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
    "Final-year AI/ML student at BIT Mesra building LLM agents, knowledge graphs & real-time pipelines. First author on an arXiv preprint, author of mnex on npm, ex-SDE intern at 123 of AI.",

  keywords: [
    "Vaibhav Dangaich",
    "AI ML developer",
    "LLM engineer",
    "knowledge graphs",
    "GraphRAG",
    "Neo4j",
    "Kùzu",
    "LangChain",
    "LangGraph",
    "mnex",
    "FOIAtlas",
    "cognitive AI agent",
    "BIT Mesra",
    "portfolio",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "Kafka",
    "Azure",
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
      "Final-year AI/ML student at BIT Mesra building LLM agents, knowledge graphs & real-time pipelines. First author on an arXiv preprint; author of mnex on npm.",
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
        {/* framer-motion server-renders its `initial` state as inline styles,
            so without JS the revealed content would stay at opacity 0 — same
            as the [data-reveal] CSS this replaced. Undo it when JS is off. */}
        <noscript>
          <style>{`
            [style*="opacity:0"] { opacity: 1 !important; }
            [style*="translateY"] { transform: none !important; }
          `}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
