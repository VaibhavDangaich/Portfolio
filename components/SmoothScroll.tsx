"use client";

import { cancelFrame, frame } from "framer-motion";
import Lenis from "lenis";
import { useEffect } from "react";

/* Momentum scrolling.
   Lenis drives the scroll position; framer-motion's frame loop drives Lenis,
   so we get one rAF for the whole page instead of two fighting each other.
   Lenis moves the real window scroll (not a transformed wrapper), so the
   existing three.js / ui.js listeners reading window.scrollY keep working. */

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    // Honour the OS setting — momentum scrolling is exactly the kind of
    // motion that triggers vestibular discomfort. Native scroll is correct here.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const lenis = new Lenis({
      // lerp beats duration here: it stays responsive to a fast flick instead
      // of committing to a fixed animation length. 0.09 is smooth without
      // that seasick lag that makes portfolios feel broken.
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      // Leave touch alone. Native iOS/Android scrolling already feels right,
      // and syncTouch is where Lenis integrations usually go wrong.
      syncTouch: false,
    });

    window.__lenis = lenis;

    const update = (data: { timestamp: number }) => lenis.raf(data.timestamp);
    frame.update(update, true);

    // ui.js binds its own smooth-scroll nav handler. Let Lenis own in-page
    // anchors instead, so the two don't animate the same scroll at once.
    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!link) return;

      const id = link.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      e.stopPropagation();
      lenis.scrollTo(target as HTMLElement, { offset: -24, duration: 1.1 });
    };

    // Capture phase so we win before ui.js's bubble-phase listener runs.
    document.addEventListener("click", onAnchorClick, true);

    return () => {
      document.removeEventListener("click", onAnchorClick, true);
      cancelFrame(update);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
