"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* Lazy wrapper for RealisticAvatar.
 *
 * The avatar bundle pulls in @react-three/fiber + @react-three/drei +
 * three + framer-motion + 11 animation files (~3 MB combined). Including
 * all of that in the initial bundle is the main cause of the "laggy" feel
 * — the browser parses + executes ~1 MB of JS before paint, then loads
 * the GLB / FBX assets, then starts the WebGL context.
 *
 * Here we:
 *   1. Code-split the avatar via `next/dynamic` so its JS lands in a
 *      separate chunk that's only fetched after main is ready.
 *   2. Defer the mount itself to `requestIdleCallback` (or a 700 ms
 *      fallback timeout) — gives the rest of the page a beat to paint
 *      and become interactive before the avatar's WebGL context spins up.
 *
 * Also skips entirely on mobile (matches the existing `display: none`
 * media rule on .dude-rig) to avoid downloading the chunk at all there. */

const RealisticAvatar = dynamic(() => import("./RealisticAvatar"), {
  ssr: false,
  loading: () => null,
});

export default function RealisticAvatarLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // skip on mobile — the rig is `display: none` under 720px anyway
    if (typeof window !== "undefined" && window.innerWidth < 720) return;

    type IdleHandle = number;
    const win = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout?: number }
      ) => IdleHandle;
      cancelIdleCallback?: (h: IdleHandle) => void;
    };

    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setReady(true), {
        timeout: 1500,
      });
      return () => win.cancelIdleCallback?.(id);
    } else {
      const t = setTimeout(() => setReady(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  if (!ready) return null;
  return <RealisticAvatar />;
}
