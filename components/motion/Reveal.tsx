"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

/* Motion primitives for the portfolio.

   The site is print-editorial — warm paper, serif italics, mono rules. So the
   motion language is "type settling onto a page", not app-UI springs: an
   expo-out curve that arrives decisively, short travel, and a whisper of blur
   so things resolve into focus rather than sliding around. */

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fires a little before the element is fully on screen, so content is
    already settling by the time the reader's eye reaches it. */
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait after the element enters view. */
  delay?: number;
  /** Travel distance in px. Negative rises from below. */
  y?: number;
  /** Horizontal travel, for rows that should slide in from the margin. */
  x?: number;
  duration?: number;
  /** Adds a short focus-pull. Skip it on very large blocks. */
  blur?: boolean;
  className?: string;
  as?: "div" | "section" | "aside" | "li" | "span";
};

export function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.85,
  blur = false,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      className={className}
      initial={{
        opacity: 0,
        y,
        x,
        filter: blur ? "blur(6px)" : undefined,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        filter: blur ? "blur(0px)" : undefined,
      }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/* Above-the-fold entrance. The hero is already in view on load, so a
   whileInView trigger would fire everything at once on the first frame —
   this plays a deliberate sequence on mount instead. */
export function Entrance({
  children,
  delay = 0,
  y = 22,
  duration = 0.9,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- staggered groups ---------------- */

const groupVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.075, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "aside";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
  /* Some cards carry their own :hover transform in CSS. Once framer-motion
     writes an inline transform, that CSS rule can no longer win — so those
     cards opt into `lift` and we reproduce the hover here instead. */
  lift = false,
  dataCursor,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
  lift?: boolean;
  dataCursor?: string;
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) {
    return (
      <Tag className={className} data-cursor={dataCursor}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      data-cursor={dataCursor}
      variants={itemVariants}
      whileHover={lift ? { y: -4 } : undefined}
      transition={lift ? { duration: 0.28, ease: EASE } : undefined}
    >
      {children}
    </Tag>
  );
}

/* An <a> flavour of StaggerItem. The contact grid styles its anchors with
   `.contact-grid a:last-child`, so the links have to stay direct grid
   children — a wrapper div would move that border rule onto the wrong node. */
export function StaggerLink({
  children,
  href,
  target,
  rel,
  className,
  dataCursor,
}: {
  children: ReactNode;
  href: string;
  target?: string;
  rel?: string;
  className?: string;
  dataCursor?: string;
}) {
  const reduce = useReducedMotion();
  const props = { href, target, rel, className, "data-cursor": dataCursor };

  if (reduce) return <a {...props}>{children}</a>;

  return (
    <motion.a {...props} variants={itemVariants}>
      {children}
    </motion.a>
  );
}

/* ---------------- masked heading reveal ----------------
   Wipes the heading up from behind its own baseline. Works with arbitrary
   children, so headings keep their <em> and inline markup intact — which a
   per-word text splitter would have flattened. */

export function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    /* Trigger on the wrapper, not the moving child — see SectionHead for why.
       An observer on an element translated 110% of its own height watches a
       box far below the heading's real position, and `once: true` makes a
       missed trigger permanent. */
    <motion.div
      className={className}
      style={{ overflow: "hidden", paddingBottom: "0.12em" }}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      <motion.div
        variants={{
          hidden: { y: "110%" },
          show: { y: "0%", transition: { duration: 1, delay, ease: EASE } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ---------------- scroll-linked parallax ----------------
   Drifts an element against the scroll as its section passes through the
   viewport. Kept deliberately small — a few dozen px reads as depth, more
   than that reads as a bug. */

export function Parallax({
  children,
  className,
  /** px of total drift across the full pass. Negative moves against scroll. */
  distance = -60,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const y = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.4 });

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/* ---------------- section scroll choreography ----------------
   Lifts and settles a whole section as it crosses the viewport: a slight
   scale-up and fade-in on approach. Subtle enough to read as depth rather
   than as an effect. */

export function SectionLift({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 62%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.55, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.985, 1]);

  if (reduce) {
    return (
      <section ref={ref} className={className} id={id}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      ref={ref}
      className={className}
      id={id}
      style={{ opacity, scale, transformOrigin: "center top" }}
    >
      {children}
    </motion.section>
  );
}
