"use client";

import { motion, useReducedMotion } from "framer-motion";

/* The § label with its 48px rule. Extracted so <SectionHead> and the Projects
   section (whose label sits outside .projects-intro) animate identically. */

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

export default function SectionLabel({ label }: { label: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className="section-label">
        <span className="line" />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <motion.div
      className="section-label"
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      <motion.span
        className="line"
        style={{ transformOrigin: "left center" }}
        variants={{
          hidden: { scaleX: 0 },
          show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
        }}
      />
      <motion.span
        variants={{
          hidden: { opacity: 0, x: -8 },
          show: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, delay: 0.15, ease: EASE },
          },
        }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
