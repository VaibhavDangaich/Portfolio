"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/* Reading progress, drawn along the top edge of the existing .frame rule
   rather than as a bar bolted to the top of the window — so it reads as the
   frame inking itself in, not as a generic progress widget. */

export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Spring the raw progress so a flick of the wheel doesn't snap the line.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        transformOrigin: "left center",
        position: "fixed",
        top: 16,
        left: 16,
        right: 16,
        height: 1.5,
        background: "var(--accent)",
        zIndex: 55,
        pointerEvents: "none",
      }}
    />
  );
}
