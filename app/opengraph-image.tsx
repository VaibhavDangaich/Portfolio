import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vaibhav Dangaich — AI/ML Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f3ee",
          padding: "64px",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* corner brackets */}
        {[
          { top: 24, left: 24 },
          { top: 24, right: 24 },
          { bottom: 24, left: 24 },
          { bottom: 24, right: 24 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 20,
              height: 20,
              border: "2px solid #1a1a1a",
              background: "#f5f3ee",
              ...pos,
              display: "flex",
            }}
          />
        ))}

        {/* top label */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 1, background: "#d8d3c8", display: "flex" }} />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#8a8580",
            }}
          >
            § 00 — portfolio
          </span>
        </div>

        {/* main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontFamily: "serif",
              fontSize: 96,
              fontWeight: 400,
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              color: "#1a1a1a",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Vaibhav</span>
            <span style={{ color: "#c2410c", fontStyle: "italic" }}>
              — Dangaich
            </span>
          </div>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: 22,
              color: "#3a3835",
              maxWidth: 620,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            AI/ML dev · LLM agents · knowledge graphs · real-time pipelines
          </p>
        </div>

        {/* bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #d8d3c8",
            paddingTop: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 32,
              fontFamily: "monospace",
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#8a8580",
            }}
          >
            <span>BIT Mesra · AIML</span>
            <span>Konect U · AI Intern</span>
            <span style={{ color: "#c2410c" }}>npm · mnex</span>
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "#d8d3c8",
              letterSpacing: "0.1em",
            }}
          >
            vaibhavdangaich.dev
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
