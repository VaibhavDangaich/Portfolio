/* 3D Lego-minifig avatar — fixed bottom-center.
 *
 * Design notes:
 *  - Classic Lego palette: yellow head/hands, orange torso, navy legs, brown
 *    hair, black-printed face. All geometry is boxes + cylinders, no spheres.
 *  - Face is a CanvasTexture wrapped on the head cylinder so the eyes /
 *    glasses / smile sit correctly on the +Z side of the head.
 *  - SHOULDERS ARE FORWARD OF THE TORSO CENTER. That fixes the prior
 *    "hand-behind-head" bug: with the pivot at z=+0.22, when arms swing up,
 *    the hands arc up *and forward*, ending in front of the head.
 *  - Carry pose: both arms raised symmetrically, hands meet in front of /
 *    above the head. The carried bulb is parented to the dude group (not a
 *    single hand) so it stays centered between the two hands.
 *  - Relight transition: rig flies to the socket using a real screen-space
 *    projection of the carried bulb (no magic numbers). On arrival, the bulb
 *    does a 720° "screw-in" rotation while it scales down, the DOM bulb
 *    relights underneath, then the dude floats back home.
 */
(function () {
  const canvas = document.getElementById('dude-canvas');
  const bubble = document.getElementById('dude-bubble');
  const bubbleText = document.getElementById('dude-bubble-text');
  if (!canvas || !window.THREE) return;

  const THREE = window.THREE;

  // ---------------- jokes ----------------
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

  // ---------------- scene + camera ----------------
  const scene = new THREE.Scene();
  // Tighter FOV + closer camera so the face is large enough to read.
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 50);
  camera.position.set(0, 0.35, 5.5);
  camera.lookAt(0, 0.15, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  if ('toneMapping' in renderer) renderer.toneMapping = THREE.ACESFilmicToneMapping;
  if ('toneMappingExposure' in renderer) renderer.toneMappingExposure = 1.05;

  // Simple procedural environment so the clearcoat on the plastic has
  // something to reflect — without this the MeshPhysicalMaterial would look
  // matte even with high clearcoat values.
  function buildEnvTexture() {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const g = c.getContext('2d');
    const grd = g.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0,    '#ffffff');
    grd.addColorStop(0.45, '#f0e8d8');
    grd.addColorStop(0.55, '#3a2a1e');
    grd.addColorStop(1,    '#1a1410');
    g.fillStyle = grd;
    g.fillRect(0, 0, 512, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  scene.environment = buildEnvTexture();

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ---------------- lights (give the plastic that ABS sheen) ----------------
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.95);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);
  const rim = new THREE.DirectionalLight(0xffc080, 0.5);
  rim.position.set(-4, 2, -3);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xc0d8ff, 0.3);
  fill.position.set(-1, 1, 5);
  scene.add(fill);

  // ---------------- palette ----------------
  // Tuned to play nice with the page's burnt-orange accent in both themes.
  const LEGO = {
    YELLOW:    0xf5cd30,  // classic minifig skin
    YELLOW_2:  0xe3b820,  // shaded yellow (for studs)
    ORANGE:    0xc2410c,  // torso (matches --accent)
    DARK_RED:  0x862b14,  // hip block
    NAVY:      0x1a3a5c,  // legs
    BLACK:     0x1a1a1a,
    WHITE:     0xf5f3ee,
    BROWN:     0x4a2c14,  // hair
    SILVER:    0xbbb8b0,
  };
  function mat(c, opts) {
    return new THREE.MeshStandardMaterial(Object.assign({
      color: c, roughness: 0.55, metalness: 0.05,
    }, opts || {}));
  }

  // Glossy ABS-plastic material with a clearcoat layer — what makes the
  // Lego pieces actually look like Lego rather than play-doh.
  function plastic(c, opts) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: c,
      roughness: 0.35,
      metalness: 0.0,
      clearcoat: 0.85,
      clearcoatRoughness: 0.18,
      sheen: 0.3,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color(0xffffff),
    }, opts || {}));
    return m;
  }

  // ---------------- face texture (printed on the head cylinder) ----------------
  // CylinderGeometry default UV: theta = u * 2π starting from +Z. So u=0
  // is +Z (camera-facing) and u=0.5 is -Z (back of head). To avoid drawing
  // across the texture seam, we draw the face centred at u=0.5 and rotate
  // the head mesh by π below to bring that band back to +Z.
  function makeFaceTexture(skinHex) {
    const W = 1024, H = 512;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');

    // background = skin colour
    ctx.fillStyle = '#' + skinHex.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, W, H);

    // Face drawn at u=0.5 in the texture (centre of canvas horizontally),
    // then the head mesh is rotated π around Y to bring this band to +Z.
    const cx = Math.round(W * 0.50);
    const cy = Math.round(H * 0.50);

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Texture is rotated 180° relative to head orientation (the cylinder is
    // flipped π around Y to position the face on +Z), so left/right at the
    // canvas level is MIRRORED on the rendered face. Symmetric design ⇒ no
    // visible difference, but keep that in mind when adding asymmetry.

    // ---- eyebrows (chunky, slightly angled) ----
    ctx.strokeStyle = '#2a1408';
    ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(cx - 118, cy - 92); ctx.lineTo(cx - 28, cy - 86); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 28, cy - 86); ctx.lineTo(cx + 118, cy - 92); ctx.stroke();

    // ---- glasses (thick black rectangular frames) ----
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 13;
    const lensW = 110, lensH = 76, lensY = cy - 48;
    const drawLens = (cxLens) => {
      ctx.beginPath();
      const r = 14;
      ctx.moveTo(cxLens - lensW/2 + r, lensY);
      ctx.lineTo(cxLens + lensW/2 - r, lensY);
      ctx.quadraticCurveTo(cxLens + lensW/2, lensY, cxLens + lensW/2, lensY + r);
      ctx.lineTo(cxLens + lensW/2, lensY + lensH - r);
      ctx.quadraticCurveTo(cxLens + lensW/2, lensY + lensH, cxLens + lensW/2 - r, lensY + lensH);
      ctx.lineTo(cxLens - lensW/2 + r, lensY + lensH);
      ctx.quadraticCurveTo(cxLens - lensW/2, lensY + lensH, cxLens - lensW/2, lensY + lensH - r);
      ctx.lineTo(cxLens - lensW/2, lensY + r);
      ctx.quadraticCurveTo(cxLens - lensW/2, lensY, cxLens - lensW/2 + r, lensY);
      ctx.stroke();
    };
    drawLens(cx - 78);
    drawLens(cx + 78);
    // bridge
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(cx - 23, cy - 16);
    ctx.lineTo(cx + 23, cy - 16);
    ctx.stroke();

    // ---- pupils (inside the lenses, slightly off-centre for an "engaged" look) ----
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(cx - 76, cy - 8, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 76, cy - 8, 10, 0, Math.PI * 2); ctx.fill();
    // bright catchlights — what really sells eyes on a face print
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(cx - 73, cy - 11, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 79, cy - 11, 3.5, 0, Math.PI * 2); ctx.fill();

    // ---- nose (just a tiny vertical line, classic minifig) ----
    ctx.strokeStyle = '#9a6a30';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 12);
    ctx.lineTo(cx - 2, cy + 38);
    ctx.stroke();

    // ---- smile ----
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(cx, cy + 68, 48, 0.10 * Math.PI, 0.90 * Math.PI);
    ctx.stroke();
    // smile corners — small tick-up curves
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(cx - 45, cy + 82); ctx.lineTo(cx - 50, cy + 76); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 45, cy + 82); ctx.lineTo(cx + 50, cy + 76); ctx.stroke();

    // a tiny blush dot on each cheek — subtle but readable
    ctx.fillStyle = 'rgba(212, 110, 50, 0.35)';
    ctx.beginPath(); ctx.arc(cx - 130, cy + 48, 18, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 130, cy + 48, 18, 0, Math.PI * 2); ctx.fill();

    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }

  // ---------------- helpers ----------------
  // Cylindrical stud — the bump on top of every Lego piece.
  function stud(radius, height, color) {
    return new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, height, 24),
      mat(color, { roughness: 0.45 })
    );
  }

  // ---------------- dude assembly ----------------
  const dude = new THREE.Group();
  scene.add(dude);
  // Tuned with the new camera (FOV 24°, z=5.5, lookAt y=0.15) so the head
  // and shoulders sit in the upper half of the canvas, hips visible at the
  // bottom, knees cropped — classic portrait framing.
  dude.position.y = -0.20;

  // ----- legs (mostly off-screen but anchor the proportions) -----
  const hips = new THREE.Mesh(
    new THREE.BoxGeometry(0.86, 0.22, 0.46),
    mat(LEGO.DARK_RED)
  );
  hips.position.y = -0.78;
  dude.add(hips);

  const legGeo = new THREE.BoxGeometry(0.38, 0.66, 0.42);
  const legL = new THREE.Mesh(legGeo, mat(LEGO.NAVY));
  legL.position.set(-0.22, -1.22, 0);
  dude.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.22;
  dude.add(legR);

  // tiny boot studs on shoes (visible if scroll brings them up)
  const bootStudL = stud(0.13, 0.05, LEGO.NAVY);
  bootStudL.position.set(-0.22, -1.58, 0.05);
  dude.add(bootStudL);
  const bootStudR = bootStudL.clone();
  bootStudR.position.x = 0.22;
  dude.add(bootStudR);

  // ----- torso (trapezoidal — wider at bottom, like a real minifig) -----
  function makeTorso() {
    const shape = new THREE.Shape();
    shape.moveTo(-0.43, -0.5);
    shape.lineTo( 0.43, -0.5);
    shape.lineTo( 0.30,  0.5);
    shape.lineTo(-0.30,  0.5);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.46,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.025,
    });
    geo.translate(0, 0, -0.23);
    return new THREE.Mesh(geo, mat(LEGO.ORANGE));
  }
  const torso = makeTorso();
  torso.material = plastic(LEGO.ORANGE);
  torso.position.y = -0.18;
  dude.add(torso);

  // chest print — a small white rectangle with a thin orange stripe (mock dev badge)
  const chestPlate = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 0.16),
    mat(LEGO.WHITE, { roughness: 0.4 })
  );
  chestPlate.position.set(0, 0.02, 0.241);
  dude.add(chestPlate);
  const chestStripe = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 0.018),
    mat(LEGO.ORANGE)
  );
  chestStripe.position.set(0, -0.05, 0.2415);
  dude.add(chestStripe);

  // neck stud — connects head to torso
  const neck = stud(0.13, 0.08, LEGO.YELLOW_2);
  neck.position.y = 0.35;
  dude.add(neck);

  // ----- head -----
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.77; // sits on the neck
  dude.add(headGroup);

  // Smaller, tapered head — top radius 0.30 (forehead width), bottom radius
  // 0.24 (chin width). The taper IS the jawline: cylinder widens toward the
  // top and narrows toward the chin, just like a real face profile.
  const HEAD_R_TOP = 0.30;
  const HEAD_R_BOT = 0.24;
  const HEAD_H = 0.54;
  const headGeo = new THREE.CylinderGeometry(HEAD_R_TOP, HEAD_R_BOT, HEAD_H, 48);
  const head = new THREE.Mesh(headGeo, plastic(LEGO.YELLOW, { roughness: 0.4 }));
  headGroup.add(head);
  // Use the smaller radius for face-feature placement so they stay clear of
  // the cylinder surface at face-center.
  const HEAD_R = HEAD_R_TOP; // shadowed for compatibility with code below

  // -----------------------------------------------------------------
  // FACE — built from real geometry, not a texture. Each piece sits at
  // z slightly greater than HEAD_R so it pokes out of the head cylinder
  // toward the camera. This is the same approach used by real-time
  // toon/Lego rigs because it can never fail to face the camera — the
  // meshes are at positive Z in head-local space, full stop.
  // -----------------------------------------------------------------
  // Features positioned just in front of the cylinder face. The head tapers,
  // so at face-center y, surface z ≈ 0.27; we sit features at z=0.275 to be
  // flush but unambiguous.
  const FACE_Z = 0.278;
  const blackPlastic = plastic(LEGO.BLACK, { roughness: 0.35 });
  const browPlastic  = plastic(0x2a1408,  { roughness: 0.55 });

  // ---- glasses ----
  function makeLensFrame(centerX, centerY) {
    const frame = new THREE.Group();
    const W = 0.135, H = 0.115, T = 0.018;   // smaller, neater
    const D = 0.016;
    const top = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), blackPlastic);
    top.position.set(0, H/2 - T/2, 0);
    frame.add(top);
    const bot = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), blackPlastic);
    bot.position.set(0, -H/2 + T/2, 0);
    frame.add(bot);
    const lft = new THREE.Mesh(new THREE.BoxGeometry(T, H, D), blackPlastic);
    lft.position.set(-W/2 + T/2, 0, 0);
    frame.add(lft);
    const rgt = new THREE.Mesh(new THREE.BoxGeometry(T, H, D), blackPlastic);
    rgt.position.set(W/2 - T/2, 0, 0);
    frame.add(rgt);
    frame.position.set(centerX, centerY, FACE_Z);
    return frame;
  }
  const lensL = makeLensFrame(-0.095, 0.035);
  const lensR = makeLensFrame( 0.095, 0.035);
  headGroup.add(lensL, lensR);

  // bridge
  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.016, 0.014),
    blackPlastic
  );
  bridge.position.set(0, 0.045, FACE_Z);
  headGroup.add(bridge);

  // temple arms (just visible past the side of each lens)
  function makeTemple(side) {
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.015, 0.015),
      blackPlastic
    );
    arm.position.set(side * 0.18, 0.035, HEAD_R - 0.06);
    arm.rotation.y = side * 0.20;
    return arm;
  }
  headGroup.add(makeTemple(-1), makeTemple(1));

  // ---- pupils ----
  const pupilGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.008, 16);
  pupilGeo.rotateX(Math.PI / 2);
  const pupilL = new THREE.Mesh(pupilGeo, blackPlastic);
  pupilL.position.set(-0.095, 0.035, FACE_Z - 0.001);
  headGroup.add(pupilL);
  const pupilR = pupilL.clone();
  pupilR.position.x = 0.095;
  headGroup.add(pupilR);

  // catchlights
  const catchGeo = new THREE.CircleGeometry(0.005, 12);
  const catchMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const catchL = new THREE.Mesh(catchGeo, catchMat);
  catchL.position.set(-0.090, 0.042, FACE_Z + 0.004);
  headGroup.add(catchL);
  const catchR = catchL.clone();
  catchR.position.x = 0.100;
  headGroup.add(catchR);

  // ---- eyebrows ----
  const browGeo = new THREE.BoxGeometry(0.095, 0.018, 0.015);
  const browL = new THREE.Mesh(browGeo, browPlastic);
  browL.position.set(-0.095, 0.135, FACE_Z);
  browL.rotation.z = 0.08;
  headGroup.add(browL);
  const browR = new THREE.Mesh(browGeo, browPlastic);
  browR.position.set(0.095, 0.135, FACE_Z);
  browR.rotation.z = -0.08;
  headGroup.add(browR);

  // ---- nose ----
  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.018, 16, 12),
    plastic(0xd4a878, { roughness: 0.55 })
  );
  nose.scale.set(1.1, 1.5, 0.7);
  nose.position.set(0, -0.025, FACE_Z + 0.004);
  headGroup.add(nose);

  // ---- smile ----
  const smileGeo = new THREE.TorusGeometry(0.065, 0.011, 6, 24, Math.PI);
  const smile = new THREE.Mesh(smileGeo, blackPlastic);
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.085, FACE_Z);
  headGroup.add(smile);

  // smile corner tick-ups
  const tickGeo = new THREE.BoxGeometry(0.018, 0.011, 0.014);
  const tickL = new THREE.Mesh(tickGeo, blackPlastic);
  tickL.position.set(-0.065, -0.085, FACE_Z);
  tickL.rotation.z = 0.7;
  headGroup.add(tickL);
  const tickR = new THREE.Mesh(tickGeo, blackPlastic);
  tickR.position.set(0.065, -0.085, FACE_Z);
  tickR.rotation.z = -0.7;
  headGroup.add(tickR);

  // soft blush
  const blushMat = new THREE.MeshBasicMaterial({
    color: 0xd4632a, transparent: true, opacity: 0.32,
  });
  const blushGeo = new THREE.CircleGeometry(0.04, 16);
  const blushL = new THREE.Mesh(blushGeo, blushMat);
  blushL.position.set(-0.17, -0.05, FACE_Z - 0.005);
  headGroup.add(blushL);
  const blushR = blushL.clone();
  blushR.position.x = 0.17;
  headGroup.add(blushR);

  // distinct jaw lip — a slightly smaller flat disc just below the head
  // chin section, gives that classic Lego "chin shelf" silhouette
  const jaw = new THREE.Mesh(
    new THREE.CylinderGeometry(HEAD_R_BOT - 0.005, HEAD_R_BOT - 0.04, 0.06, 32),
    plastic(LEGO.YELLOW_2, { roughness: 0.6 })
  );
  jaw.position.y = -HEAD_H / 2 - 0.03;
  headGroup.add(jaw);

  // Small ear bumps — repositioned for the smaller, tapered head.
  const earGeo = new THREE.SphereGeometry(0.058, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const earL = new THREE.Mesh(earGeo, plastic(LEGO.YELLOW));
  earL.position.set(-HEAD_R_TOP + 0.005, 0.02, 0);
  earL.rotation.z = Math.PI / 2;
  earL.scale.set(0.6, 1, 0.7);
  headGroup.add(earL);
  const earR = earL.clone();
  earR.position.x = HEAD_R_TOP - 0.005;
  earR.rotation.z = -Math.PI / 2;
  headGroup.add(earR);

  // Old chin disc removed — replaced by the `jaw` mesh that's now built
  // alongside the face features, sized to match the tapered head's chin
  // radius. The taper itself is the jawline.

  // head stud (top) — re-positioned for the smaller head
  const headStud = stud(0.11, 0.07, LEGO.YELLOW_2);
  headStud.position.y = HEAD_H / 2 + 0.035;
  headGroup.add(headStud);

  // ----- hair (box-shaped Lego hairpiece) -----
  // sits over the top + back of the head, leaves a fringe at the front
  // hair sized to the smaller head
  const hairTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.66, 0.14, 0.62),
    plastic(LEGO.BROWN, { roughness: 0.7, clearcoat: 0.2 })
  );
  hairTop.position.y = HEAD_H / 2 + 0.05;
  headGroup.add(hairTop);
  const hairBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.66, 0.24, 0.26),
    plastic(LEGO.BROWN, { roughness: 0.7, clearcoat: 0.2 })
  );
  hairBack.position.set(0, HEAD_H / 2 - 0.12, -0.20);
  headGroup.add(hairBack);
  const fringe = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.10, 0.07),
    plastic(LEGO.BROWN, { roughness: 0.7, clearcoat: 0.2 })
  );
  fringe.position.set(0, HEAD_H / 2 + 0.005, HEAD_R_TOP + 0.03);
  fringe.rotation.x = -0.22;
  headGroup.add(fringe);

  // ----- ARMS (now with elbow joints) -----
  // Shoulder pivot sits at the top corner of the trapezoidal torso, slightly
  // forward of the torso centre so that when arms raise they arc UP-AND-
  // FORWARD (not behind the head).
  //
  // Structure: shoulder (Group) ─ upper arm (Mesh) ─ elbow (Group) ─ forearm
  // + wrist + hand (Meshes inside elbow). The elbow joint is what gives the
  // arm natural bending in typing / thinking / carry poses.
  //
  // Convention: rotation.x on shoulder swings the whole arm forward/back
  // (negative = up & forward). rotation.z on shoulder swings it sideways
  // (positive = -X direction, so LEFT arm: +z swings outward, RIGHT arm: -z
  // swings outward; INWARD is the opposite sign).
  const SHOULDER_X = 0.32;   // pulled in to match torso-top corners (was 0.46)
  const SHOULDER_Y = 0.30;   // closer to the top of the torso
  const SHOULDER_Z = 0.20;
  const UPPER_LEN  = 0.42;
  const FOREARM_LEN = 0.42;
  const HAND_DROP   = 0.10;  // distance from forearm end to hand grip centre

  function makeArm(side) {
    const arm = new THREE.Group();          // shoulder pivot
    arm.position.set(side * SHOULDER_X, SHOULDER_Y, SHOULDER_Z);

    // shoulder ball — full sphere that integrates the arm into the torso
    // visually. Sized to mostly cover the joint between torso and arm.
    const shoulder = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 20, 16),
      plastic(LEGO.ORANGE)
    );
    arm.add(shoulder);

    // upper arm — rigid cylinder hanging straight down from the shoulder
    const upper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.105, 0.095, UPPER_LEN, 20),
      plastic(LEGO.ORANGE)
    );
    upper.position.y = -UPPER_LEN / 2 - 0.04;
    arm.add(upper);

    // elbow pivot — placed at the bottom of the upper arm. Rotating this
    // group bends the forearm. Children (forearm, wrist, hand) move with it.
    const elbow = new THREE.Group();
    elbow.position.y = -UPPER_LEN - 0.04;
    arm.add(elbow);

    // elbow joint ball (a slightly darker tone for visual definition)
    const elbowBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.092, 18, 14),
      plastic(LEGO.ORANGE, { roughness: 0.5 })
    );
    elbow.add(elbowBall);

    // forearm — hangs from the elbow
    const forearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.092, 0.085, FOREARM_LEN, 20),
      plastic(LEGO.ORANGE)
    );
    forearm.position.y = -FOREARM_LEN / 2 - 0.03;
    elbow.add(forearm);

    // wrist — short yellow cylinder
    const wrist = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 0.08, 16),
      plastic(LEGO.YELLOW)
    );
    wrist.position.y = -FOREARM_LEN - 0.08;
    elbow.add(wrist);

    // hand — Lego C-clip. The open side faces inward (toward the body
    // centreline) so it looks like it can hold something gripped in front.
    const handGeo = new THREE.TorusGeometry(0.075, 0.034, 8, 18, Math.PI * 1.35);
    const hand = new THREE.Mesh(handGeo, plastic(LEGO.YELLOW));
    hand.position.y = -FOREARM_LEN - 0.16;
    hand.rotation.x = Math.PI / 2;
    hand.rotation.y = side === -1 ? -Math.PI * 0.25 : Math.PI * 1.25;
    elbow.add(hand);

    return { group: arm, shoulder, upper, elbow, forearm, wrist, hand };
  }

  const armL = makeArm(-1);
  const armR = makeArm(1);
  dude.add(armL.group, armR.group);

  // ----- CARRIED BULB -----
  // Parented to the dude (not a single hand). Positioned where the two raised
  // hands meet when in carry pose. Visible only during the relight transition.
  const carriedBulb = new THREE.Group();

  const carriedGlassMat = new THREE.MeshStandardMaterial({
    color: 0xffe6b0,
    emissive: 0xffa040,
    emissiveIntensity: 1.0,
    transparent: true,
    opacity: 0.96,
    roughness: 0.18,
    metalness: 0.1,
  });
  const carriedGlass = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 28, 28),
    carriedGlassMat
  );
  carriedGlass.scale.y = 1.28;
  carriedGlass.position.y = -0.04;
  carriedBulb.add(carriedGlass);

  // silver socket cap
  const carriedSocket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.1, 0.09, 18),
    mat(LEGO.SILVER, { metalness: 0.7, roughness: 0.3 })
  );
  carriedSocket.position.y = 0.20;
  carriedBulb.add(carriedSocket);
  // screw threads (stacked thin rings)
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.094, 0.013, 6, 18),
      mat(0xdadada, { metalness: 0.6, roughness: 0.35 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.16 + i * 0.027;
    carriedBulb.add(ring);
  }
  // contact tip on the very top
  const contactTip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.05, 0.04, 12),
    mat(LEGO.BLACK)
  );
  contactTip.position.y = 0.27;
  carriedBulb.add(contactTip);

  // glow
  const carriedLight = new THREE.PointLight(0xffd49a, 1.6, 4.5);
  carriedLight.position.y = -0.02;
  carriedBulb.add(carriedLight);

  // Park the bulb where the two hands meet in carry pose. Derived from the
  // arm geometry: with rotation.x = -π·0.95, rotation.z = ∓0.42, and the
  // arm/wrist/hand offsets defined above, the hand tips land at roughly
  // Carried-bulb position: with the new arm rig (shoulder at SHOULDER_X=0.32,
  // SHOULDER_Y=0.30, total reach ≈ UPPER_LEN+FOREARM_LEN+0.16 = 1.0), and
  // the carry pose's slight elbow bend (-0.20), the hands meet at roughly
  //   (±0.15, 1.30, 0.34) in dude-local
  // — so the bulb between them sits at (0, 1.30, 0.34).
  carriedBulb.position.set(0, 1.30, 0.34);
  carriedBulb.visible = false;
  dude.add(carriedBulb);

  // ---------------- pose state machine ----------------
  // Each pose specifies six angles per arm-pair: shoulder X/Z + elbow X.
  //
  //   shoulder.rotation.x: -π/2 = arm horizontal forward, -π = straight up
  //   shoulder.rotation.z: CONSISTENT sign convention (derived from Three.js
  //     Euler 'XYZ' order: matrix = Rx · Ry · Rz, so Z applied to the vector
  //     first, then X — and X rotation doesn't change the x-coordinate).
  //
  //     LEFT arm  (shoulder x=-0.32):  +aLsz → hand x increases → inward
  //                                    -aLsz → hand x decreases → outward
  //     RIGHT arm (shoulder x=+0.32):  +aRsz → hand x increases → outward
  //                                    -aRsz → hand x decreases → inward
  //
  //   elbow.rotation.x: negative bends forearm forward (positive curls it back)
  const POSES = {
    // arms hang naturally, with a slight outward curve like a real minifig
    idle:      { hX:  0.00, hY:  0.00,
                 aLsx:  0.00,            aLsz: -0.10, aLex:  0.00,
                 aRsx:  0.00,            aRsz:  0.10, aRex:  0.00,
                 type: 'idle' },
    // right arm UP-AND-OUT, slight elbow bend
    wave:      { hX: -0.05, hY: -0.18,
                 aLsx:  0.00,            aLsz: -0.10, aLex:  0.00,
                 aRsx: -Math.PI * 0.82,  aRsz:  0.55, aRex: -0.30,
                 type: 'wave' },
    // both arms forward + slightly inward, elbows bent like at a keyboard
    typing:    { hX:  0.28, hY:  0.00,
                 aLsx: -Math.PI * 0.18,  aLsz:  0.22, aLex: -Math.PI * 0.42,
                 aRsx: -Math.PI * 0.18,  aRsz: -0.22, aRex: -Math.PI * 0.42,
                 type: 'type' },
    // right arm angled forward + out, elbow tight (thumbs-up pose)
    thumbs:    { hX:  0.00, hY:  0.00,
                 aLsx:  0.00,            aLsz: -0.10, aLex:  0.00,
                 aRsx: -Math.PI * 0.32,  aRsz:  0.22, aRex: -Math.PI * 0.55,
                 type: 'idle' },
    nod:       { hX:  0.35, hY:  0.00,
                 aLsx:  0.00,            aLsz: -0.10, aLex:  0.00,
                 aRsx:  0.00,            aRsz:  0.10, aRex:  0.00,
                 type: 'nod' },
    // both arms up and OUTWARD in triumph, slight elbow bend
    celebrate: { hX: -0.22, hY:  0.00,
                 aLsx: -Math.PI * 0.92,  aLsz: -0.55, aLex: -0.18,
                 aRsx: -Math.PI * 0.92,  aRsz:  0.55, aRex: -0.18,
                 type: 'celeb' },
    bye:       { hX:  0.00, hY:  0.16,
                 aLsx:  0.00,            aLsz: -0.10, aLex:  0.00,
                 aRsx: -Math.PI * 0.78,  aRsz:  0.55, aRex: -0.40,
                 type: 'wave' },
    // right arm raised partially, elbow heavily flexed → hand to chin
    think:     { hX:  0.18, hY:  0.20,
                 aLsx:  0.00,            aLsz: -0.10, aLex:  0.00,
                 aRsx: -Math.PI * 0.34,  aRsz: -0.40, aRex: -Math.PI * 0.80,
                 type: 'idle' },
    // CARRY: arms straight up, hands meet at centreline via INWARD Z swing
    //   (left arm: +aLsz inward toward +X, right arm: -aRsz inward toward -X).
    // Bulb at dude-local (0, 1.30, 0.34) sits between them.
    carry:     { hX: -0.18, hY:  0.00,
                 aLsx: -Math.PI * 0.92,  aLsz:  0.18, aLex: -0.22,
                 aRsx: -Math.PI * 0.92,  aRsz: -0.18, aRex: -0.22,
                 type: 'carry' },
  };

  let currentPose = 'idle';
  const state = {
    hX: 0, hY: 0,
    aLsx: 0, aLsz: -0.10, aLex: 0,
    aRsx: 0, aRsz:  0.10, aRex: 0,
    typeBlend: 0, waveBlend: 0, celebBlend: 0, nodBlend: 0, carryBlend: 0,
  };

  function setPose(name) {
    if (POSES[name]) currentPose = name;
  }
  window.__setDudePose = setPose;

  // ---------------- tick loop ----------------
  let time = 0;
  let last = performance.now();

  function tick(now) {
    const dt = Math.min(48, now - last) / 1000;
    last = now;
    time += dt;

    const target = POSES[currentPose] || POSES.idle;
    const lerp = (a, b, k = 0.10) => a + (b - a) * k;

    state.hX   = lerp(state.hX,   target.hX);
    state.hY   = lerp(state.hY,   target.hY);
    state.aLsx = lerp(state.aLsx, target.aLsx);
    state.aLsz = lerp(state.aLsz, target.aLsz);
    state.aLex = lerp(state.aLex, target.aLex);
    state.aRsx = lerp(state.aRsx, target.aRsx);
    state.aRsz = lerp(state.aRsz, target.aRsz);
    state.aRex = lerp(state.aRex, target.aRex);
    state.typeBlend  = lerp(state.typeBlend,  target.type === 'type'  ? 1 : 0, 0.12);
    state.waveBlend  = lerp(state.waveBlend,  target.type === 'wave'  ? 1 : 0, 0.12);
    state.celebBlend = lerp(state.celebBlend, target.type === 'celeb' ? 1 : 0, 0.12);
    state.nodBlend   = lerp(state.nodBlend,   target.type === 'nod'   ? 1 : 0, 0.12);
    state.carryBlend = lerp(state.carryBlend, target.type === 'carry' ? 1 : 0, 0.10);

    // ambient body sway — gentle, plastic-feeling
    dude.rotation.y = Math.sin(time * 0.7) * 0.06;
    dude.rotation.z = Math.sin(time * 0.5) * 0.02;

    // head: target + idle bob + nod overlay
    headGroup.rotation.x = state.hX
      + Math.sin(time * 1.3) * 0.018
      + Math.sin(time * 6) * 0.22 * state.nodBlend;
    headGroup.rotation.y = state.hY + Math.sin(time * 0.9) * 0.035;
    headGroup.position.y = 0.77 + Math.sin(time * 1.5) * 0.018;

    // ---- arm animation overlays ----
    // Wave: right hand oscillates side-to-side; elbow flexes slightly with it
    const waveOsc      = Math.sin(time * 9.5) * 0.40 * state.waveBlend;
    const waveElbowR   = Math.sin(time * 9.5 + 0.3) * 0.18 * state.waveBlend;
    // Typing: shoulders rock, ELBOWS flap (where the actual key-press energy lives)
    const typeOscL     = Math.sin(time * 12 + 0.4) * 0.06 * state.typeBlend;
    const typeOscR     = Math.sin(time * 12 + Math.PI + 0.4) * 0.06 * state.typeBlend;
    const typeElbowL   = Math.sin(time * 16) * 0.14 * state.typeBlend;
    const typeElbowR   = Math.sin(time * 16 + Math.PI * 0.55) * 0.14 * state.typeBlend;
    // Celebrate: arms shake, elbows pump
    const celebOsc     = Math.sin(time * 5.5) * 0.16 * state.celebBlend;
    const celebElbow   = Math.sin(time * 8) * 0.18 * state.celebBlend;

    armL.group.rotation.x = state.aLsx + typeOscL;
    armL.group.rotation.z = state.aLsz - celebOsc;
    armL.elbow.rotation.x = state.aLex + typeElbowL - celebElbow;

    armR.group.rotation.x = state.aRsx + typeOscR;
    armR.group.rotation.z = state.aRsz + waveOsc + celebOsc;
    armR.elbow.rotation.x = state.aRex + typeElbowR + waveElbowR - celebElbow;

    // Bulb visibility/glow is tied to carryBlend so the bulb fades in as the
    // arms come up. EXCEPT:
    //   (a) during the screw-in animation, which owns scale + emissive + light
    //       intensity directly — don't stomp it
    //   (b) after the bulb's been delivered to the socket, it stays GONE for
    //       the remainder of this relight cycle (the dude must fly home
    //       empty-handed)
    if (!screwing) {
      if (bulbDelivered) {
        carriedBulb.visible = false;
      } else {
        carriedBulb.visible = state.carryBlend > 0.01 || relighting;
        carriedGlass.material.opacity = 0.96 * Math.max(state.carryBlend, relighting ? 1 : 0);
        carriedLight.intensity = 1.6 * Math.max(state.carryBlend, relighting ? 1 : 0);
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ---------------- scroll-driven pose switching ----------------
  const SECTION_POSES = {
    'top':        'wave',
    'about':      'think',
    'experience': 'typing',
    'projects':   'thumbs',
    'stack':      'thumbs',
    'education':  'nod',
    'wins':       'celebrate',
    'contact':    'bye',
  };
  const sectionJokes = {
    'top':        [0, 1, 4, 16, 24],
    'about':      [3, 9, 14, 22, 28],
    'experience': [2, 7, 8, 19, 26],
    'projects':   [5, 17, 25, 27, 29],
    'stack':      [6, 10, 11, 15, 20, 31],
    'education':  [12, 13, 18, 30],
    'wins':       [21, 23],
    'contact':    [1, 16, 24],
  };

  let activeSection = 'top';
  const sectionObserver = new IntersectionObserver((entries) => {
    let best = null;
    entries.forEach((entry) => {
      if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
        best = entry;
      }
    });
    if (best && SECTION_POSES[best.target.id] && !relighting) {
      activeSection = best.target.id;
      setPose(SECTION_POSES[activeSection]);
    }
  }, { threshold: [0.3, 0.6] });
  Object.keys(SECTION_POSES).forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  // ---------------- jokes ----------------
  let jokeIdx = -1;
  function pickJoke() {
    const pool = sectionJokes[activeSection];
    if (pool && pool.length) {
      const idx = pool[Math.floor(Math.random() * pool.length)];
      if (idx === jokeIdx) return pool[(pool.indexOf(idx) + 1) % pool.length];
      return idx;
    }
    return (jokeIdx + 1) % JOKES.length;
  }
  // Each joke pops in at a slightly different tilt — kills the "always
  // identical box" feel. Range ±3.5° so it stays readable.
  let typewriterTimer = null;
  function stopTypewriter() {
    if (typewriterTimer) { clearTimeout(typewriterTimer); typewriterTimer = null; }
  }
  function typewriteInto(el, full) {
    stopTypewriter();
    el.textContent = '';
    let i = 0;
    const tick = () => {
      el.textContent = full.slice(0, ++i);
      if (i >= full.length) { typewriterTimer = null; return; }
      // a touch more breath after sentence-ending punctuation for cadence
      const last = full[i - 1];
      const extra = (last === ',' || last === '.' || last === '?' || last === '!') ? 110 : 0;
      typewriterTimer = setTimeout(tick, 18 + extra);
    };
    tick();
  }
  function showJoke(idx) {
    if (!bubble || !bubbleText) return;
    bubble.classList.remove('show');
    stopTypewriter();
    setTimeout(() => {
      const tilt = (Math.random() * 7 - 3.5).toFixed(2) + 'deg';
      bubble.style.setProperty('--bubble-tilt', tilt);
      bubble.classList.add('show');
      typewriteInto(bubbleText, JOKES[idx]);
      jokeIdx = idx;
    }, 320);
  }
  function nextJoke() { showJoke(pickJoke()); }
  setTimeout(() => showJoke(0), 2200);
  setInterval(() => { if (!relighting) nextJoke(); }, 8500);
  if (bubble) {
    bubble.addEventListener('click', (e) => {
      e.preventDefault();
      nextJoke();
      if (window.__playSound) window.__playSound('pop');
    });
  }

  // ---------------- theme awareness ----------------
  function applyTheme(dark) {
    // accent (torso) brightens slightly in dark mode to match the page's --accent
    const torsoCol  = dark ? 0xf97316 : LEGO.ORANGE;
    [torso, armL.upper, armR.upper, chestStripe].forEach((m) => {
      if (m && m.material) m.material.color.setHex(torsoCol);
    });
  }
  document.addEventListener('themechange', (e) => applyTheme(!!(e.detail && e.detail.dark)));
  if (document.body.classList.contains('dark')) applyTheme(true);

  // ---------------- RELIGHT TRANSITION ----------------
  // The dude flies up to the broken bulb on the page, holding a new bulb
  // between his raised hands. On arrival the carried bulb spins 720° while
  // shrinking (the "screw it in" beat); the DOM bulb relights underneath.
  // Then he floats back home.
  let relighting = false;
  let screwing = false;
  // Sticky flag: once the bulb has been screwed into the socket during a
  // relight cycle, it stays gone. Without this, the tick loop sees
  // state.carryBlend > 0 (arms still in carry pose during the lerp back to
  // idle) plus relighting === true, and helpfully turns the carried bulb
  // back on — so it looks like the dude flew home carrying the bulb he just
  // installed. Reset to false at the start of every new relight cycle.
  let bulbDelivered = false;
  let screwAnim = null;

  // Compute, in pixels, where the carried-bulb group's WORLD position
  // currently projects onto the page. Used to align the rig with the socket
  // — replaces the prior hard-coded -176 / -51 magic numbers.
  function projectCarriedBulbToScreen() {
    const rig = document.getElementById('dude-rig');
    if (!rig) return null;
    // make sure the dude's transforms are up to date for this frame
    dude.updateMatrixWorld(true);
    const v = new THREE.Vector3();
    carriedBulb.getWorldPosition(v);
    v.project(camera);

    const rect = canvas.getBoundingClientRect();
    const screenX = rect.left + (v.x * 0.5 + 0.5) * rect.width;
    const screenY = rect.top  + (-v.y * 0.5 + 0.5) * rect.height;
    return { x: screenX, y: screenY };
  }

  // Fit the carried bulb into the socket with a real-feeling motion.
  //
  // Timeline (totalMs = 1300):
  //   0 — 0.10  | press-in:    bulb nudges UP into the socket, no rotation yet
  //   0.10 — 0.78 | threading: bulb stays at full size, rotates 3 full turns
  //                with an ease-in-out (slow start as threads catch, ramp up,
  //                slow at the very end as it bottoms out)
  //   0.78 — 0.82 | bottoms-out beat: tiny stutter as the threads run out
  //   0.82 — 0.95 | lock:       bright glow swell + sharp shrink (the "click")
  //   0.82       | DOM bulb relights synchronously with the brightness peak
  //   0.95 — 1.00 | cleanup:   bulb vanishes, sticky flag set
  //
  // The brightness curve is multi-stage: rises gently during threading,
  // hits a sharp peak at the lock moment (1.0 → 3.0), then drops to 0 as
  // the carried bulb is "transferred" to the socket.
  function fitBulbIntoSocket(onLitDOMBulb, onDone) {
    if (screwAnim) cancelAnimationFrame(screwAnim);
    screwing = true;
    carriedBulb.visible = true;
    carriedBulb.scale.setScalar(1);
    carriedBulb.rotation.y = 0;
    carriedBulb.position.y = 1.08; // reset baseline (we nudge it in stage 1)

    const TOTAL = 1300;
    const startTime = performance.now();
    const baseY = 1.08;
    let lit = false;

    // easeInOutCubic: slow start, fast middle, slow end — feels like a real
    // bulb threading in
    const easeInOutCubic = (x) => x < 0.5
      ? 4 * x * x * x
      : 1 - Math.pow(-2 * x + 2, 3) / 2;

    function step(now) {
      const t = Math.min(1, (now - startTime) / TOTAL);

      // ---- vertical position: small upward press during 0..0.10 ----
      let yOff;
      if (t < 0.10) {
        yOff = (t / 0.10) * 0.04; // up 0.04 units over 100ms
      } else if (t < 0.82) {
        yOff = 0.04;
      } else {
        // stays in place during lock + cleanup
        yOff = 0.04;
      }
      carriedBulb.position.y = baseY + yOff;

      // ---- rotation: 3 full turns, ease-in-out, only during threading ----
      if (t < 0.10) {
        carriedBulb.rotation.y = 0;
      } else if (t < 0.82) {
        const threadT = (t - 0.10) / (0.82 - 0.10);
        const eased = easeInOutCubic(threadT);
        carriedBulb.rotation.y = eased * Math.PI * 6; // 3 full turns
      }
      // after 0.82: rotation frozen

      // ---- scale: full size until 0.85, then sharp shrink (the "click") ----
      let scale;
      if (t < 0.85) {
        scale = 1;
      } else if (t < 0.97) {
        // rapid shrink with a slight ease so it doesn't just pop
        const shrinkT = (t - 0.85) / (0.97 - 0.85);
        scale = Math.max(0.01, 1 - shrinkT * shrinkT);
      } else {
        scale = 0.01;
      }
      carriedBulb.scale.setScalar(scale);

      // ---- glow: builds during threading, peaks at lock, fades on transfer ----
      let glow;
      if (t < 0.78) {
        // gentle build, 1.0 → 1.6
        glow = 1.0 + (t / 0.78) * 0.6;
      } else if (t < 0.85) {
        // ramp toward peak
        const k = (t - 0.78) / (0.85 - 0.78);
        glow = 1.6 + k * 1.6; // → 3.2
      } else if (t < 0.95) {
        // hold peak briefly, then start falling
        const k = (t - 0.85) / (0.95 - 0.85);
        glow = 3.2 * (1 - k * 0.7);
      } else {
        glow = 0;
      }
      carriedGlassMat.emissiveIntensity = glow;
      carriedLight.intensity = 1.6 * glow;

      // ---- DOM bulb relights at the brightness peak (t = 0.82) ----
      if (!lit && t >= 0.82) {
        lit = true;
        if (onLitDOMBulb) onLitDOMBulb();
      }

      if (t < 1) {
        screwAnim = requestAnimationFrame(step);
      } else {
        screwAnim = null;
        screwing = false;
        // bulb is now in the socket — sticky flag keeps it gone
        bulbDelivered = true;
        carriedBulb.visible = false;
        carriedBulb.scale.setScalar(1);
        carriedBulb.rotation.y = 0;
        carriedBulb.position.y = baseY;
        carriedGlassMat.emissiveIntensity = 1.0;
        carriedLight.intensity = 1.6;
        if (onDone) onDone();
      }
    }
    screwAnim = requestAnimationFrame(step);
  }

  window.__dudeRelight = function (onAttach, onComplete) {
    if (relighting) return false;
    const rig = document.getElementById('dude-rig');
    const bulbBtn = document.getElementById('dm-bulb-btn');
    if (!rig || !bulbBtn) {
      if (onAttach) onAttach();
      if (onComplete) onComplete();
      return false;
    }
    relighting = true;
    bulbDelivered = false; // fresh cycle; bulb starts in the dude's hands

    if (bubble) bubble.classList.remove('show');
    setPose('carry');

    // Allow a beat for the pose to settle (so the lerped arm/head positions
    // and therefore the carried bulb's world position are accurate) before
    // we measure where the bulb projects.
    const POSE_SETTLE_MS = 380;

    setTimeout(() => {
      // Where the carried bulb is currently on screen vs. where the DOM
      // socket is. Move the rig by the delta so they line up.
      const bulbScreen = projectCarriedBulbToScreen();
      const bulbRect = bulbBtn.getBoundingClientRect();
      const targetX = bulbRect.left + bulbRect.width / 2;
      // socket is at the very top of the bulb (just under the cord)
      const targetY = bulbRect.top + bulbRect.height * 0.18;
      const dx = (targetX - bulbScreen.x);
      const dy = (targetY - bulbScreen.y);

      rig.classList.remove('flying-back');
      rig.style.setProperty('--dude-x', dx + 'px');
      rig.style.setProperty('--dude-y', dy + 'px');
      rig.style.setProperty('--dude-rot', '-4deg');

      // arrival timing matches the CSS transition (1.2s on .dude-rig)
      const FLIGHT_MS = 1200;
      setTimeout(() => {
        if (window.__playSound) window.__playSound('release');

        // Fit the bulb. The animation itself fires the DOM-relight callback
        // at its brightness peak (t=0.82, ≈1066ms in), so flash + click line up.
        fitBulbIntoSocket(
          () => {
            if (onAttach) onAttach();
            if (window.__playSound) window.__playSound('pop');
          },
          () => {
            // Bulb is now in the socket and bulbDelivered=true keeps it that
            // way through the flight home. Drop the arms *immediately* —
            // before the flight starts — so the dude visibly lets go before
            // pushing off. Then fly back after a short beat.
            setPose(SECTION_POSES[activeSection] || 'idle');
            setTimeout(() => {
              rig.classList.add('flying-back');
              rig.style.setProperty('--dude-x', '0px');
              rig.style.setProperty('--dude-y', '0px');
              rig.style.setProperty('--dude-rot', '2deg');
              setTimeout(() => {
                rig.style.setProperty('--dude-rot', '0deg');
                rig.classList.remove('flying-back');
                relighting = false;
                if (onComplete) onComplete();
              }, 1100);
            }, 220);
          }
        );
      }, FLIGHT_MS);
    }, POSE_SETTLE_MS);

    return true;
  };
})();
