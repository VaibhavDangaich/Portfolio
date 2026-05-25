import Script from "next/script";

/* Server component. The `v` timestamp is regenerated on every request in
   dev (since this module re-runs server-side per render), so each fresh
   page load gets a unique URL for the static JS modules — defeats Safari/
   Chrome's aggressive caching of /public/ assets that was making module
   edits look invisible. Production gets a stable stamp so caching works. */
export default function ClientScripts() {
  const v =
    process.env.NODE_ENV === "production" ? "p1" : String(Date.now());

  return (
    <>
      <Script
        src="https://unpkg.com/three@0.160.0/build/three.min.js"
        strategy="afterInteractive"
      />
      <Script src={`/scripts/hero-graph.js?v=${v}`} strategy="afterInteractive" />
      <Script src={`/scripts/physics-cards.js?v=${v}`} strategy="afterInteractive" />
      <Script src={`/scripts/ui.js?v=${v}`} strategy="afterInteractive" />
      <Script src={`/scripts/darkmode.js?v=${v}`} strategy="afterInteractive" />
      {/* dude-avatar.js (the procedural Lego avatar) is replaced by
          components/RealisticAvatar.tsx — an R3F component that loads a
          rigged GLB. Keep the file in /public/scripts/ for reference. */}
    </>
  );
}
