"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import SectionLabel from "@/components/motion/SectionLabel";

/* Every section opens the same way: a 48px rule, a mono § label, then a big
   serif title. Choreographing them together — rule draws, label fades in
   behind it, title wipes up from its own baseline — gives the whole page one
   consistent beat instead of nine sections each fading in independently. */

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

export default function SectionHead({
  label,
  children,
}: {
  /** The § label text, e.g. "§ 01 — About" */
  label: string;
  /** The heading content. Keeps inline <em> markup intact. */
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <>
      <SectionLabel label={label} />

      {reduce ? (
        <h2 className="section-title">{children}</h2>
      ) : (
        /* Overflow-clipped so the title wipes up from behind its own baseline.
           The padding stops descenders (g, y, j) being shaved by the clip. */
        <div style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
          <motion.h2
            className="section-title"
            initial={{ y: "108%" }}
            whileInView={{ y: "0%" }}
            viewport={VIEWPORT}
            transition={{ duration: 1.05, delay: 0.08, ease: EASE }}
          >
            {children}
          </motion.h2>
        </div>
      )}
    </>
  );
}
