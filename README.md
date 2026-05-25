# Vaibhav — Portfolio (Next.js)

Editorial paper aesthetic with a 3D knowledge-graph hero, drag-throw physics
cards, a hanging bulb that an arrow shatters to toggle dark mode, and a 3D
dude avatar that tells tech jokes as you scroll.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **`next/font/google`** for Instrument Serif, Space Grotesk, JetBrains Mono, Caveat
- **Vanilla CSS** in `app/globals.css` — the prototype's hand-tuned styles, not Tailwind
- **Three.js** loaded via CDN inside `<Script>` (matches the prototype; keeps the bundle lean)
- The imperative behaviors (graph, physics, cursor, dark-mode choreography, dude avatar)
  live as IIFE scripts in `public/scripts/` and are loaded by `components/ClientScripts.tsx`
  with `strategy="afterInteractive"`, so they run once per page, in dependency order,
  after the React tree has hydrated.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

## Layout

```
app/
  layout.tsx       fonts + html/body shell
  page.tsx         composes the section components + floating widgets
  globals.css      all the design CSS (paper grain, frame, hero, dark mode, bulb rig, arrow, shards, dude avatar)
components/
  Frame, TopBar
  Hero, About, Experience, Projects, Skills, Education, Achievements, Contact
  DarkModeBulb     the hanging bulb + cord + halo
  DarkModeFX       the arrow, shard container, impact-flash overlay
  TryPrompt        the sketchy "try clicking me!" comic prompt
  DudeAvatar       the 3D dude's mount point
  Cursor           custom cursor + trail dots
  SoundToggle      bottom-left sound toggle
  ClientScripts    loads three.js + the five behavior modules in order
public/scripts/
  hero-graph.js     Three.js graph: drag to rotate, click a node to scroll
  physics-cards.js  drag-and-throw springs on the project cards
  ui.js             custom cursor, scroll reveal, text scramble, Web Audio, magnetic nav
  darkmode.js       arrow → shatter → dark mode choreography
  dude-avatar.js    3D dude with scroll-driven poses and a rotating joke bubble
```

## Cross-script coupling

The scripts communicate through three `window` globals, set up in this order
(matching the `<Script>` load order):

| set by              | name                    | called by                 |
|---------------------|-------------------------|---------------------------|
| `hero-graph.js`     | `window.__updateGraphTheme(isDark)` | `darkmode.js` (on theme flip) |
| `ui.js`             | `window.__playSound(kind)` | every interactive module |
| `dude-avatar.js`    | `window.__dudeRelight(onAttach, onComplete)` | `darkmode.js` (dark → light) |

Each call site is null-checked, so re-ordering wouldn't crash — but the
current order matches the prototype.

## Notes

- `reactStrictMode: false` in `next.config.mjs` — the imperative scripts attach
  listeners and start RAF loops once; double-invoked effects in dev would
  duplicate them. `next/script` itself dedupes by `src`, so the modules are
  safe regardless, but this keeps any future `useEffect` interactives clean too.
- Custom cursor self-disables under 720px (in CSS).
- The dude avatar hides under 720px.
- Three.js loads from `unpkg.com`. Swap in a self-hosted copy or
  `npm i three` + rewrite the modules as ES modules if you want a fully
  offline build.
- The original prototype is preserved verbatim under `_prototype-archive/`
  for reference.

## TODO (left from the design assistant's notes)

- Drop real URLs into the LinkedIn / GitHub / LeetCode placeholders in
  `components/Contact.tsx`
- Drop real repo/live links into the two cards in `components/Projects.tsx`
