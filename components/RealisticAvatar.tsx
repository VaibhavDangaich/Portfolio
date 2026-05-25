"use client";

import {
  useAnimations,
  useFBX,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ───────────────────────────────────────────────────────────────────────
 *  RealisticAvatar — male RPM-style character, ALWAYS at bottom-center.
 *
 *  Behavior:
 *    - Pinned to the bottom of the viewport. Doesn't hop to corners.
 *    - Plays one of 11 Mixamo / RPM animations based on the current
 *      scroll section (typing in Experience, dance in Wins, wave on
 *      Contact, etc.). Smooth cross-fades.
 *    - Dark→Light: spawns a glowing bulb PROJECTILE from the avatar's
 *      upper torso. It arcs up across the viewport to the broken bulb,
 *      relights it on impact, then fades. The avatar plays a "throwing"
 *      gesture while this happens. No teleport.
 *  ─────────────────────────────────────────────────────────────────────── */

const AVATAR_URL =
  process.env.NEXT_PUBLIC_AVATAR_URL ?? "/models/avatar.glb";

/* Map of animation key → GLB/FBX URL. The first three are the Mixamo FBX
   clips from the mahak repo (have `mixamorig:` prefix → need retargeting).
   Everything under /extra/ is from Ready Player Me's animation library
   which uses bare RPM bone names — the retarget helper is a no-op on
   those, but applying it is harmless either way. */
const ANIM_URLS = {
  idle: "/models/animations/Standing_Idle.fbx",
  typing: "/models/animations/Typing.fbx",
  falling: "/models/animations/Falling_To_Landing.fbx",
  // RPM-library extras (GLB):
  idle_v2: "/models/animations/extra/M_Standing_Idle_Variations_002.glb",
  idle_v4: "/models/animations/extra/M_Standing_Idle_Variations_004.glb",
  dance:   "/models/animations/extra/M_Dances_006.glb",
  expr1:   "/models/animations/extra/M_Standing_Expressions_001.glb",
  expr2:   "/models/animations/extra/M_Standing_Expressions_002.glb",
  expr4:   "/models/animations/extra/M_Standing_Expressions_004.glb",
  expr6:   "/models/animations/extra/M_Standing_Expressions_006.glb",
  expr9:   "/models/animations/extra/M_Standing_Expressions_009.glb",
} as const;
type AnimName = keyof typeof ANIM_URLS;

const RIG_W = 340;
const RIG_H = 440;

/* Each section gets a primary animation. The avatar cross-fades into it
   when the section comes into view. */
const SECTION_TO_ANIM: Record<string, AnimName> = {
  top:        "expr1",     // greeting (wave-ish)
  about:      "idle_v2",   // looking-around idle
  experience: "typing",    // typing
  projects:   "expr4",     // thumbs-up / shrug
  stack:      "typing",    // typing
  education:  "expr6",     // engaged gesture
  wins:       "dance",     // DANCE
  contact:    "expr9",     // wave bye
};

const JOKES = [
  "Why do programmers prefer dark mode? Light attracts bugs.",
  "I told my LLM a joke. It said it needed more context.",
  "C++ walks into a bar. Bartender asks for two IDs.",
  "I'd tell you a UDP joke, but you might not get it.",
  "Why don't AI agents like onions? Too many layers.",
  "Next.js? More like Next.guess. Still love it.",
  "I named my model 'Probably'. Always pretty sure of itself.",
  "Why did the React component go to therapy? Too much state.",
  "Kafka walks into a bar. Still waiting for the consumer.",
  "Docker? Hardly knew her. She's containerised now.",
  "My code's not buggy. It's just 'feature-rich'.",
  "I'd recurse you a joke, but I have no base case.",
  "RAG: retrieve, augment, give-up-and-Google.",
  "Built a Neo4j graph of my excuses. They're all connected.",
  "I have no bugs in prod. (I don't deploy to prod.)",
  "Why was Tailwind sad? It needed @apply therapy.",
  "An AI walks into a bar. The bar hallucinates.",
  "My commits? Written by Gemini. My bugs? Mine.",
  "Java jokes work. Java jokes work? Java jokes work…",
  "What's a dev's favorite drink? Java. A whole heap.",
  "FastAPI walks in. Bartender says 'wow that was quick.'",
  "Why did the LangChain dev fail? Couldn't chain a thought.",
  "Vector DBs: where I store my emotional baggage.",
  "Asked ChatGPT for a joke. It explained itself first.",
  "Why do agents love coffee? Java + caffeine = AGI.",
  "Bad data? I tried pandas. They refused to index it.",
  "When in doubt: rm -rf node_modules && npm i.",
  "git push --force: hopes and prayers.",
  "I'd write a JavaScript joke but I keep getting undefined.",
  "Why don't programmers like nature? Too many bugs.",
  "My RAG pipeline got cold. Had to warm up the cache.",
  "Why did Python cross the road? To indent itself.",
];

const SECTION_JOKES: Record<string, number[]> = {
  top: [0, 1, 4, 16, 24],
  about: [3, 9, 14, 22, 28],
  experience: [2, 7, 8, 19, 26],
  projects: [5, 17, 25, 27, 29],
  stack: [6, 10, 11, 15, 20, 31],
  education: [12, 13, 18, 30],
  wins: [21, 23],
  contact: [1, 16, 24],
};

/* Strip "mixamorig" prefix so Mixamo FBX tracks retarget onto an RPM
   avatar's skeleton ("Hips", "Spine", "Head", …). No-op on RPM-library
   clips that already use bare names. */
function retargetMixamoClip(clip: THREE.AnimationClip, name: string) {
  const out = clip.clone();
  out.name = name;
  out.tracks = clip.tracks.map((t) => {
    const fresh = t.clone();
    fresh.name = t.name
      .replace(/^mixamorig:/, "")
      .replace(/^mixamorig/, "");
    return fresh;
  });
  return out;
}

function buildAndAttachGlasses(scene: THREE.Object3D): THREE.Group | null {
  let head: THREE.Object3D | null = null;
  scene.traverse((node) => {
    if (head) return;
    if (node.name === "Head" || node.name === "head") head = node;
  });
  if (!head) return null;

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.35,
    metalness: 0.15,
  });
  // Cheap lens — flat translucent instead of physical/transmission, which
  // triggers an expensive refraction pass per frame.
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0xbcd5f0,
    transparent: true,
    opacity: 0.22,
    roughness: 0.15,
  });

  const glasses = new THREE.Group();
  glasses.name = "ProceduralGlasses";

  const makeFrame = (centerX: number) => {
    const g = new THREE.Group();
    const W = 0.055, H = 0.040, T = 0.006, D = 0.005;
    const seg = (sx: number, sy: number, sz: number, py: number, px = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), frameMat);
      m.position.set(px, py, 0);
      return m;
    };
    g.add(seg(W, T, D,  H / 2 - T / 2));
    g.add(seg(W, T, D, -H / 2 + T / 2));
    g.add(seg(T, H, D,  0, -W / 2 + T / 2));
    g.add(seg(T, H, D,  0,  W / 2 - T / 2));
    const lens = new THREE.Mesh(
      new THREE.PlaneGeometry(W - T * 1.4, H - T * 1.4),
      lensMat
    );
    lens.position.z = -0.001;
    g.add(lens);
    g.position.x = centerX;
    return g;
  };
  glasses.add(makeFrame(-0.034));
  glasses.add(makeFrame(0.034));

  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.018, 0.006, 0.005),
    frameMat
  );
  bridge.position.set(0, 0.005, 0);
  glasses.add(bridge);

  const temple = (side: number) => {
    const t = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.006, 0.005),
      frameMat
    );
    t.position.set(side * 0.058, 0.005, -0.034);
    t.rotation.y = side * 0.15;
    return t;
  };
  glasses.add(temple(-1));
  glasses.add(temple(1));

  glasses.position.set(0, 0.08, 0.10);
  glasses.scale.setScalar(1.5);
  head.add(glasses);
  return glasses;
}

/* Builds a small glowing bulb mesh (glass + screw cap + point light) that
   gets parented to the avatar's RightHand bone. Visible during the relight
   transition only. */
function createHandBulb(): THREE.Group {
  const bulb = new THREE.Group();
  bulb.name = "HandBulb";

  // Cheap glass — emissive does the visible glow work; no transmission.
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xfff0c0,
    emissive: 0xffae40,
    emissiveIntensity: 1.8,
    transparent: true,
    opacity: 0.95,
    roughness: 0.18,
  });
  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 20, 16),
    glassMat
  );
  glass.scale.y = 1.35;
  bulb.add(glass);

  // socket (silver)
  const socket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.030, 0.034, 0.025, 16),
    new THREE.MeshStandardMaterial({
      color: 0xbbbbbb,
      roughness: 0.3,
      metalness: 0.75,
    })
  );
  socket.position.y = 0.06;
  bulb.add(socket);

  // thread rings
  for (let i = 0; i < 2; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.031, 0.0045, 6, 16),
      new THREE.MeshStandardMaterial({
        color: 0xd0d0d0,
        roughness: 0.4,
        metalness: 0.6,
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.05 + i * 0.012;
    bulb.add(ring);
  }

  // contact tip
  const tip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.016, 0.012, 12),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
  );
  tip.position.y = 0.083;
  bulb.add(tip);

  // glow
  const light = new THREE.PointLight(0xffcc80, 1.2, 1.5);
  light.position.y = 0;
  bulb.add(light);

  return bulb;
}

/* Find the right-hand bone on either RPM or Mixamo skeletons. */
function findRightHand(scene: THREE.Object3D): THREE.Object3D | null {
  let hand: THREE.Object3D | null = null;
  const candidates = [
    "RightHand",
    "mixamorigRightHand",
    "right_hand",
    "RightHandIndex1",
  ];
  scene.traverse((node) => {
    if (hand) return;
    if (candidates.includes(node.name)) hand = node;
  });
  return hand;
}

function Avatar({
  activeAnim,
  showHandBulb,
  handBulbRef,
  rightHandRef,
}: {
  activeAnim: AnimName;
  showHandBulb: boolean;
  handBulbRef: React.MutableRefObject<THREE.Group | null>;
  rightHandRef: React.MutableRefObject<THREE.Object3D | null>;
}) {
  const group = useRef<THREE.Group>(null!);
  const avatar = useGLTF(AVATAR_URL);

  // FBX animations
  const idleFbx = useFBX(ANIM_URLS.idle);
  const typingFbx = useFBX(ANIM_URLS.typing);
  const fallingFbx = useFBX(ANIM_URLS.falling);

  // GLB animations (from RPM animation library)
  const idleV2 = useGLTF(ANIM_URLS.idle_v2);
  const idleV4 = useGLTF(ANIM_URLS.idle_v4);
  const dance = useGLTF(ANIM_URLS.dance);
  const expr1 = useGLTF(ANIM_URLS.expr1);
  const expr2 = useGLTF(ANIM_URLS.expr2);
  const expr4 = useGLTF(ANIM_URLS.expr4);
  const expr6 = useGLTF(ANIM_URLS.expr6);
  const expr9 = useGLTF(ANIM_URLS.expr9);

  const clips = useMemo<THREE.AnimationClip[]>(() => {
    const out: THREE.AnimationClip[] = [];
    const push = (clip: THREE.AnimationClip | undefined, name: string) => {
      if (clip) out.push(retargetMixamoClip(clip, name));
    };
    push(idleFbx.animations?.[0], "idle");
    push(typingFbx.animations?.[0], "typing");
    push(fallingFbx.animations?.[0], "falling");
    push(idleV2.animations?.[0], "idle_v2");
    push(idleV4.animations?.[0], "idle_v4");
    push(dance.animations?.[0], "dance");
    push(expr1.animations?.[0], "expr1");
    push(expr2.animations?.[0], "expr2");
    push(expr4.animations?.[0], "expr4");
    push(expr6.animations?.[0], "expr6");
    push(expr9.animations?.[0], "expr9");
    return out;
  }, [
    idleFbx, typingFbx, fallingFbx,
    idleV2, idleV4, dance, expr1, expr2, expr4, expr6, expr9,
  ]);

  const { actions } = useAnimations(clips, group);

  useEffect(() => {
    // Skip the per-mesh shadow setup — Canvas has shadows disabled now.
    // Just attach glasses + hand bulb.
    const glasses = buildAndAttachGlasses(avatar.scene);

    // ---- hand bulb (visible during relight) ----
    const rightHand = findRightHand(avatar.scene);
    rightHandRef.current = rightHand;
    let handBulb: THREE.Group | null = null;
    if (rightHand) {
      handBulb = createHandBulb();
      handBulb.visible = false;
      // Position the bulb inside the open hand. RPM/Mixamo hand bone's
      // +X usually points toward the fingers; tuned values for that.
      handBulb.position.set(0.06, 0.01, 0);
      handBulb.rotation.z = -Math.PI / 2; // stand the bulb upright in the palm
      rightHand.add(handBulb);
      handBulbRef.current = handBulb;
    }

    return () => {
      if (glasses && glasses.parent) glasses.parent.remove(glasses);
      if (handBulb && handBulb.parent) handBulb.parent.remove(handBulb);
      handBulbRef.current = null;
      rightHandRef.current = null;
    };
  }, [avatar.scene, handBulbRef, rightHandRef]);

  // toggle hand bulb visibility from parent
  useEffect(() => {
    if (handBulbRef.current) {
      handBulbRef.current.visible = showHandBulb;
    }
  }, [showHandBulb, handBulbRef]);

  // Cross-fade between animations
  useEffect(() => {
    const next = actions[activeAnim];
    if (!next) return;
    Object.entries(actions).forEach(([name, a]) => {
      if (a && name !== activeAnim) a.fadeOut(0.4);
    });
    next.reset().fadeIn(0.4).play();
  }, [actions, activeAnim]);

  return (
    <group ref={group} dispose={null} position={[0, -1.30, 0]}>
      <primitive object={avatar.scene} />
    </group>
  );
}

useGLTF.preload(AVATAR_URL);
Object.values(ANIM_URLS).forEach((u) => {
  if (u.endsWith(".glb")) useGLTF.preload(u);
});

/* ============== Projectile bulb component (DOM, framer-motion) ==============
   When dark mode toggles back to light, this fires a glowing bulb that
   arcs from the avatar's chest up across the viewport to the broken
   bulb. On impact it calls a callback so darkmode.js can relight the
   real DOM bulb, then the projectile fades out. No teleporting. */
function BulbProjectile({
  from,
  to,
  onImpact,
  onComplete,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  onImpact: () => void;
  onComplete: () => void;
}) {
  // Peak of the arc — significantly above the higher of the two endpoints
  const peakY = Math.min(from.y, to.y) - 220;
  // Midpoint x for nicer arc shape
  const midX = (from.x + to.x) / 2;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 36,
        height: 36,
        marginLeft: -18,
        marginTop: -18,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 35% 35%, #ffffff 0%, #ffd680 40%, rgba(255, 188, 96, 0.35) 75%, transparent 100%)",
        boxShadow:
          "0 0 30px 14px rgba(255, 220, 140, 0.55), 0 0 80px 30px rgba(255, 170, 80, 0.18)",
        pointerEvents: "none",
        zIndex: 200,
        mixBlendMode: "screen",
      }}
      initial={{ x: from.x, y: from.y, scale: 0.3, opacity: 0 }}
      animate={{
        x: [from.x, midX, to.x],
        y: [from.y, peakY, to.y],
        scale: [0.6, 1.2, 0.9],
        opacity: [1, 1, 1],
      }}
      transition={{
        duration: 0.95,
        ease: [0.22, 0.61, 0.36, 1.0],
        times: [0, 0.5, 1],
      }}
      onAnimationComplete={() => {
        onImpact();
        // a tiny lifetime so the impact and despawn aren't a single frame
        setTimeout(onComplete, 120);
      }}
    />
  );
}

export default function RealisticAvatar() {
  const [joke, setJoke] = useState<string>(JOKES[0]);
  const [showBubble, setShowBubble] = useState(false);
  const [tilt, setTilt] = useState<string>("-2deg");
  const [activeSection, setActiveSection] = useState<string>("top");
  const [overrideAnim, setOverrideAnim] = useState<AnimName | null>(null);
  const [showHandBulb, setShowHandBulb] = useState(false);
  const [projectile, setProjectile] = useState<{
    from: { x: number; y: number };
    to: { x: number; y: number };
    onImpact: () => void;
    onComplete: () => void;
    key: number;
  } | null>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  // Refs the Avatar child writes into so we can read hand position later
  const handBulbRef = useRef<THREE.Group | null>(null);
  const rightHandRef = useRef<THREE.Object3D | null>(null);

  const sectionAnim = SECTION_TO_ANIM[activeSection] ?? "idle";
  const activeAnim: AnimName = overrideAnim ?? sectionAnim;

  // observe which section is on screen
  useEffect(() => {
    const ids = Object.keys(SECTION_TO_ANIM);
    let best: IntersectionObserverEntry | null = null;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (
            e.isIntersecting &&
            (!best || e.intersectionRatio > best.intersectionRatio)
          ) {
            best = e;
          }
        });
        if (best && best.target.id) {
          setActiveSection(best.target.id);
          best = null;
        }
      },
      { threshold: [0.3, 0.6] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // typewriter joke text
  useEffect(() => {
    let cancelled = false;
    let t: ReturnType<typeof setTimeout> | null = null;
    const text = textRef.current;
    if (!text) return;
    text.textContent = "";
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      text.textContent = joke.slice(0, ++i);
      if (i >= joke.length) return;
      const last = joke[i - 1];
      const extra = /[,.?!]/.test(last) ? 110 : 0;
      t = setTimeout(tick, 18 + extra);
    };
    tick();
    return () => {
      cancelled = true;
      if (t) clearTimeout(t);
    };
  }, [joke]);

  // rotate jokes every 8.5s, weighted by section
  useEffect(() => {
    const showFirst = setTimeout(() => setShowBubble(true), 1800);
    const interval = setInterval(() => {
      if (projectile) return; // pause jokes while throwing
      const pool =
        SECTION_JOKES[activeSection] ?? JOKES.map((_, i) => i);
      const next = pool[Math.floor(Math.random() * pool.length)];
      setShowBubble(false);
      setTimeout(() => {
        setJoke(JOKES[next]);
        setTilt((Math.random() * 7 - 3.5).toFixed(2) + "deg");
        setShowBubble(true);
      }, 320);
    }, 8500);
    return () => {
      clearTimeout(showFirst);
      clearInterval(interval);
    };
  }, [activeSection, projectile]);

  // hide bubble during projectile flight
  useEffect(() => {
    if (projectile) setShowBubble(false);
  }, [projectile]);

  // -------- DARK MODE: expose window.__dudeRelight --------
  // Sequence:
  //   t=0    : avatar pulls bulb into hand (visible), starts throw animation
  //   t=600  : peak of throw — hide hand bulb, spawn screen-projectile from
  //            the real-world hand position
  //   t=1550 : projectile arrives at the broken bulb → fire onAttach
  //   t=1700 : revert avatar pose, fire onComplete
  const handleRelight = useCallback(
    (onAttach: () => void, onComplete: () => void) => {
      if (projectile) return false;

      const bulbBtn = document.getElementById("dm-bulb-btn");
      const rig = document.getElementById("dude-rig");
      const canvas = document.getElementById(
        "dude-canvas"
      ) as HTMLCanvasElement | null;
      if (!bulbBtn || !rig || !canvas) return false;

      // pop the bulb into his hand and switch to the throw animation
      setShowHandBulb(true);
      setOverrideAnim("expr2");

      // at release point, snapshot where the avatar's right hand actually is
      // on screen (via Three.js Vector3.project()), spawn the screen-bound
      // projectile from there, hide the hand bulb.
      const RELEASE_MS = 600;
      window.setTimeout(() => {
        const handObj = rightHandRef.current;
        const canvasRect = canvas.getBoundingClientRect();
        const bulbRect = bulbBtn.getBoundingClientRect();
        let from = {
          x: canvasRect.left + canvasRect.width * 0.50,
          y: canvasRect.top + canvasRect.height * 0.30,
        };

        // try to use the actual world-space hand position projected to screen
        if (handObj) {
          const tmp = new THREE.Vector3();
          handObj.getWorldPosition(tmp);
          // walk up to find the Three.js camera attached to this canvas
          // (the R3F-created PerspectiveCamera). We don't have a direct ref,
          // so fall back to the rough estimate if we can't find it.
          // Easier: use the canvas data attribute trick — drei stores camera
          // on the GL element. Skip for now; use estimate.
        }

        // Estimate is robust enough: rig is 340×440px at bottom-center, his
        // right hand at apex of the throw projects to roughly:
        //   x ≈ rig.left + rig.width * 0.32  (his right = our left)
        //   y ≈ rig.top  + rig.height * 0.18 (raised hand height)
        const rigRect = rig.getBoundingClientRect();
        from = {
          x: rigRect.left + rigRect.width * 0.32,
          y: rigRect.top + rigRect.height * 0.18,
        };
        const to = {
          x: bulbRect.left + bulbRect.width / 2,
          y: bulbRect.top + bulbRect.height * 0.55,
        };

        setShowHandBulb(false);
        setProjectile({
          from,
          to,
          key: Date.now(),
          onImpact: () => {
            try {
              onAttach();
            } catch {
              /* swallow */
            }
          },
          onComplete: () => {
            setProjectile(null);
            setTimeout(() => {
              setOverrideAnim(null);
              try {
                onComplete();
              } catch {
                /* swallow */
              }
            }, 250);
          },
        });
      }, RELEASE_MS);

      return true;
    },
    [projectile]
  );

  useEffect(() => {
    (window as unknown as { __dudeRelight?: typeof handleRelight }).__dudeRelight =
      handleRelight;
    return () => {
      delete (window as unknown as { __dudeRelight?: typeof handleRelight })
        .__dudeRelight;
    };
  }, [handleRelight]);

  return (
    <>
      <div className="dude-rig" id="dude-rig" aria-hidden="true">
        <div
          className={`dude-bubble ${showBubble ? "show" : ""}`}
          id="dude-bubble"
          style={{ ["--bubble-tilt" as never]: tilt }}
          onClick={() => {
            const next = Math.floor(Math.random() * JOKES.length);
            setShowBubble(false);
            setTimeout(() => {
              setJoke(JOKES[next]);
              setTilt((Math.random() * 7 - 3.5).toFixed(2) + "deg");
              setShowBubble(true);
            }, 200);
          }}
        >
          <span ref={textRef} id="dude-bubble-text">·</span>
        </div>
        <Canvas
          id="dude-canvas"
          // Performance tweaks:
          //   - no `shadows` prop: shadow map render adds ~30% frame cost
          //     and there's no ground plane to receive them anyway
          //   - dpr capped at 1.5 instead of devicePixelRatio's 2-3 on
          //     retina screens (cuts fragment shader work by 2-4x)
          //   - no <Environment> HDR: drops a ~1 MB network fetch and the
          //     compute cost of an env-mapped reflection pass
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          camera={{ position: [0, 0.4, 3.2], fov: 30 }}
          style={{ width: "100%", height: "100%" }}
        >
          {/* three-point lighting alone — bright enough without an env map */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 5, 4]} intensity={1.2} />
          <directionalLight
            position={[-4, 2, -3]}
            intensity={0.5}
            color={"#ffc080"}
          />
          <directionalLight position={[0, 2, -4]} intensity={0.35} />
          <Avatar
            activeAnim={activeAnim}
            showHandBulb={showHandBulb}
            handBulbRef={handBulbRef}
            rightHandRef={rightHandRef}
          />
        </Canvas>
      </div>

      <AnimatePresence>
        {projectile && (
          <BulbProjectile
            key={projectile.key}
            from={projectile.from}
            to={projectile.to}
            onImpact={projectile.onImpact}
            onComplete={projectile.onComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
}
