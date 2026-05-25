/* 3D dude avatar — fixed bottom-center.
   - Built from Three.js primitives (head + glasses + hoodie + arms)
   - Pose state machine driven by which section is on screen
   - Speech bubble cycles through tech dad-jokes; click to skip */
(function () {
  const canvas = document.getElementById('dude-canvas');
  const bubble = document.getElementById('dude-bubble');
  const bubbleText = document.getElementById('dude-bubble-text');
  if (!canvas || !window.THREE) return;

  const THREE = window.THREE;

  // ---- jokes pool ----
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

  // ---- scene ----
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0.55, 6.4);
  camera.lookAt(0, 0.35, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- lights ----
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
  keyLight.position.set(2, 4, 5);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xffd9a8, 0.35);
  rimLight.position.set(-3, 2, -2);
  scene.add(rimLight);

  // ---- materials ----
  const COL = {
    SKIN:  0xe8c89c,
    SKIN2: 0xc99a6e,
    HAIR:  0x2a1a0c,
    FRAME: 0x1a1a1a,
    SHIRT: 0xc2410c,
    WHITE: 0xf5f3ee,
  };
  function mat(c, opts) {
    return new THREE.MeshStandardMaterial(Object.assign({
      color: c, roughness: 0.7, metalness: 0.1,
    }, opts || {}));
  }

  // ---- dude assembly ----
  const dude = new THREE.Group();
  scene.add(dude);
  dude.position.y = -0.25;

  // -- head pivot (so head rotates from neck) --
  const headPivot = new THREE.Group();
  headPivot.position.y = 0.95;
  dude.add(headPivot);

  // skull
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), mat(COL.SKIN));
  headMesh.scale.set(1, 1.1, 0.95);
  headPivot.add(headMesh);

  // hair cap (top hemisphere)
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.1),
    mat(COL.HAIR)
  );
  hairCap.position.y = 0.04;
  hairCap.scale.y = 0.78;
  headPivot.add(hairCap);

  // side hair flick
  const flick = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), mat(COL.HAIR));
  flick.position.set(0.14, 0.36, 0.34);
  flick.scale.set(0.7, 0.4, 0.5);
  headPivot.add(flick);

  // ears
  const earGeo = new THREE.SphereGeometry(0.09, 16, 16);
  const earL = new THREE.Mesh(earGeo, mat(COL.SKIN));
  earL.position.set(-0.5, 0, 0);
  earL.scale.set(0.5, 1, 0.5);
  headPivot.add(earL);
  const earR = earL.clone();
  earR.position.x = 0.5;
  headPivot.add(earR);

  // glasses
  const glassMat = mat(COL.FRAME, { roughness: 0.3, metalness: 0.5 });
  const lensGeo = new THREE.TorusGeometry(0.16, 0.022, 12, 32);
  const lensL = new THREE.Mesh(lensGeo, glassMat);
  lensL.position.set(-0.21, 0.06, 0.5);
  headPivot.add(lensL);
  const lensR = lensL.clone();
  lensR.position.x = 0.21;
  headPivot.add(lensR);
  // bridge
  const bridge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, 0.1, 8),
    glassMat
  );
  bridge.rotation.z = Math.PI / 2;
  bridge.position.set(0, 0.07, 0.5);
  headPivot.add(bridge);
  // temple arms (the part going to the ears)
  const tempLGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.34, 8);
  const tempL = new THREE.Mesh(tempLGeo, glassMat);
  tempL.rotation.z = Math.PI / 2;
  tempL.position.set(-0.35, 0.06, 0.34);
  headPivot.add(tempL);
  const tempR = tempL.clone();
  tempR.position.x = 0.35;
  headPivot.add(tempR);

  // eyes (small pupils behind glasses)
  const eyeGeo = new THREE.SphereGeometry(0.038, 12, 12);
  const eyeL = new THREE.Mesh(eyeGeo, mat(COL.FRAME));
  eyeL.position.set(-0.21, 0.06, 0.52);
  headPivot.add(eyeL);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.21;
  headPivot.add(eyeR);

  // eyebrows
  const browGeo = new THREE.BoxGeometry(0.2, 0.035, 0.03);
  const browL = new THREE.Mesh(browGeo, mat(COL.HAIR));
  browL.position.set(-0.21, 0.27, 0.5);
  browL.rotation.z = 0.06;
  headPivot.add(browL);
  const browR = browL.clone();
  browR.position.x = 0.21;
  browR.rotation.z = -0.06;
  headPivot.add(browR);

  // nose
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.045, 0.13, 10),
    mat(COL.SKIN2)
  );
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, -0.08, 0.56);
  headPivot.add(nose);

  // mouth (smile arc — a flat torus segment)
  const mouth = new THREE.Mesh(
    new THREE.TorusGeometry(0.13, 0.022, 8, 16, Math.PI),
    mat(COL.FRAME)
  );
  mouth.rotation.z = Math.PI; // flip the arc downward like a smile
  mouth.position.set(0, -0.22, 0.5);
  headPivot.add(mouth);

  // -- torso --
  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 1.2, 0.6),
    mat(COL.SHIRT)
  );
  torso.position.y = 0;
  dude.add(torso);

  // collar / hoodie
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.09, 12, 24),
    mat(COL.SHIRT, { roughness: 0.85 })
  );
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.55;
  dude.add(collar);

  // hoodie strings
  const stringGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.4, 8);
  const stringL = new THREE.Mesh(stringGeo, mat(COL.WHITE));
  stringL.position.set(-0.1, 0.34, 0.27);
  dude.add(stringL);
  const stringR = stringL.clone();
  stringR.position.x = 0.1;
  dude.add(stringR);
  const tipGeo = new THREE.SphereGeometry(0.022, 8, 8);
  const tipL = new THREE.Mesh(tipGeo, mat(COL.WHITE));
  tipL.position.set(-0.1, 0.14, 0.27);
  dude.add(tipL);
  const tipR = tipL.clone();
  tipR.position.x = 0.1;
  dude.add(tipR);

  // a small accent square on the shirt (like a chest print)
  const print = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.18, 0.01),
    mat(COL.WHITE)
  );
  print.position.set(0.32, 0.15, 0.31);
  dude.add(print);

  // -- arms (groups rotate from shoulder) --
  function makeArm(side) {
    const arm = new THREE.Group();
    arm.position.set(side * 0.6, 0.42, 0);

    const upper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.10, 0.78, 16),
      mat(COL.SHIRT)
    );
    upper.position.y = -0.39;
    arm.add(upper);

    const hand = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 16, 16),
      mat(COL.SKIN)
    );
    hand.position.y = -0.82;
    arm.add(hand);

    return arm;
  }
  const armL = makeArm(-1);
  const armR = makeArm(1);
  dude.add(armL, armR);

  // initial natural arm hang
  armL.rotation.z = 0.08;
  armR.rotation.z = -0.08;

  // ---- carried bulb (only visible during the relight transition) ----
  const carriedBulb = new THREE.Group();
  const carriedGlassMat = new THREE.MeshStandardMaterial({
    color: 0xffe8b8,
    emissive: 0xff9c40,
    emissiveIntensity: 0.55,
    transparent: true,
    opacity: 0.94,
    roughness: 0.35,
  });
  const carriedGlass = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 18, 18),
    carriedGlassMat
  );
  carriedGlass.scale.y = 1.25;
  carriedBulb.add(carriedGlass);
  const carriedSocket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.085, 0.06, 12),
    mat(0x666060, { roughness: 0.4, metalness: 0.5 })
  );
  carriedSocket.position.y = 0.2;
  carriedBulb.add(carriedSocket);
  // little filament glow
  const carriedLight = new THREE.PointLight(0xffd9a8, 1.2, 3.5);
  carriedLight.position.y = 0.05;
  carriedBulb.add(carriedLight);
  // attach to right hand (the second child of armR group, see makeArm)
  const handR = armR.children[1];
  carriedBulb.position.y = 0.08;
  carriedBulb.visible = false;
  handR.add(carriedBulb);

  // ---- poses ----
  // each pose specifies target rotations; idle has subtle ambient motion baked in tick()
  const POSES = {
    idle:      { headX:  0.00, headY:  0.00, armL:{x: 0.00, z: 0.08}, armR:{x: 0.00, z:-0.08}, type: 'idle' },
    wave:      { headX: -0.02, headY: -0.18, armL:{x: 0.00, z: 0.08}, armR:{x:-2.50, z:-0.50}, type: 'wave' },
    typing:    { headX:  0.30, headY:  0.00, armL:{x:-1.10, z: 0.45}, armR:{x:-1.10, z:-0.45}, type: 'type' },
    thumbs:    { headX:  0.00, headY:  0.00, armL:{x: 0.00, z: 0.08}, armR:{x:-1.80, z:-0.30}, type: 'idle' },
    nod:       { headX:  0.35, headY:  0.00, armL:{x: 0.00, z: 0.08}, armR:{x: 0.00, z:-0.08}, type: 'nod' },
    celebrate: { headX: -0.22, headY:  0.00, armL:{x:-2.90, z: 0.40}, armR:{x:-2.90, z:-0.40}, type: 'celeb' },
    bye:       { headX:  0.00, headY:  0.16, armL:{x: 0.00, z: 0.08}, armR:{x:-2.40, z:-0.55}, type: 'wave' },
    think:     { headX:  0.18, headY:  0.18, armL:{x: 0.00, z: 0.08}, armR:{x:-1.95, z:-0.60}, type: 'idle' },
    carry:     { headX: -0.08, headY:  0.10, armL:{x: 0.00, z: 0.08}, armR:{x:-2.85, z:-0.25}, type: 'carry' },
  };

  let currentPose = 'idle';
  const state = {
    headX: 0, headY: 0,
    armLX: 0, armLZ: 0.08, armRX: 0, armRZ: -0.08,
    typeBlend: 0, waveBlend: 0, celebBlend: 0, nodBlend: 0,
  };

  function setPose(name) {
    if (POSES[name]) currentPose = name;
  }
  window.__setDudePose = setPose;

  // ---- tick loop ----
  let time = 0;
  let last = performance.now();

  function tick(now) {
    const dt = Math.min(48, now - last) / 1000;
    last = now;
    time += dt;

    const target = POSES[currentPose] || POSES.idle;
    const lerp = (cur, tgt, k = 0.08) => cur + (tgt - cur) * k;

    state.headX = lerp(state.headX, target.headX);
    state.headY = lerp(state.headY, target.headY);
    state.armLX = lerp(state.armLX, target.armL.x);
    state.armLZ = lerp(state.armLZ, target.armL.z);
    state.armRX = lerp(state.armRX, target.armR.x);
    state.armRZ = lerp(state.armRZ, target.armR.z);
    state.typeBlend  = lerp(state.typeBlend,  target.type === 'type'  ? 1 : 0, 0.12);
    state.waveBlend  = lerp(state.waveBlend,  target.type === 'wave'  ? 1 : 0, 0.12);
    state.celebBlend = lerp(state.celebBlend, target.type === 'celeb' ? 1 : 0, 0.12);
    state.nodBlend   = lerp(state.nodBlend,   target.type === 'nod'   ? 1 : 0, 0.12);

    // ambient body sway
    dude.rotation.y = Math.sin(time * 0.7) * 0.07;
    dude.rotation.z = Math.sin(time * 0.5) * 0.025;

    // head: target rot + idle bob + nod overlay
    headPivot.rotation.x = state.headX
      + Math.sin(time * 1.4) * 0.025
      + (Math.sin(time * 6) * 0.25 * state.nodBlend);
    headPivot.rotation.y = state.headY + Math.sin(time * 0.9) * 0.04;
    headPivot.position.y = 0.95 + Math.sin(time * 1.5) * 0.022;

    // arm targets + wave/type/celebrate oscillation
    const waveOsc = Math.sin(time * 9) * 0.35 * state.waveBlend;
    const typeOscL = Math.sin(time * 14) * 0.12 * state.typeBlend;
    const typeOscR = Math.sin(time * 14 + Math.PI) * 0.12 * state.typeBlend;
    const celebOsc = Math.sin(time * 5.5) * 0.15 * state.celebBlend;

    armL.rotation.x = state.armLX + typeOscL;
    armL.rotation.z = state.armLZ - celebOsc;
    armR.rotation.x = state.armRX + typeOscR;
    armR.rotation.z = state.armRZ + waveOsc + celebOsc;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ---- scroll-based pose switching ----
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
    entries.forEach(entry => {
      if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
        best = entry;
      }
    });
    if (best && SECTION_POSES[best.target.id]) {
      activeSection = best.target.id;
      setPose(SECTION_POSES[activeSection]);
    }
  }, { threshold: [0.3, 0.6] });

  Object.keys(SECTION_POSES).forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  // ---- jokes ----
  let jokeIdx = -1;
  function pickJoke() {
    const pool = sectionJokes[activeSection];
    if (pool && pool.length) {
      const idx = pool[Math.floor(Math.random() * pool.length)];
      if (idx === jokeIdx) {
        return pool[(pool.indexOf(idx) + 1) % pool.length];
      }
      return idx;
    }
    return (jokeIdx + 1) % JOKES.length;
  }
  function showJoke(idx) {
    if (!bubble || !bubbleText) return;
    bubble.classList.remove('show');
    setTimeout(() => {
      bubbleText.textContent = JOKES[idx];
      bubble.classList.add('show');
      jokeIdx = idx;
    }, 320);
  }
  function nextJoke() { showJoke(pickJoke()); }

  setTimeout(() => showJoke(0), 2200);
  setInterval(nextJoke, 8500);

  if (bubble) {
    bubble.addEventListener('click', (e) => {
      e.preventDefault();
      nextJoke();
      if (window.__playSound) window.__playSound('pop');
    });
  }

  // ---- theme awareness: tweak shirt + skin in dark mode ----
  function applyTheme(dark) {
    const shirt = dark ? 0xf97316 : 0xc2410c;
    const skin  = dark ? 0xddb88b : 0xe8c89c;
    [torso, collar, armL.children[0], armR.children[0]].forEach(m => {
      if (m && m.material) m.material.color.setHex(shirt);
    });
    [headMesh, earL, earR, armL.children[1], armR.children[1]].forEach(m => {
      if (m && m.material) m.material.color.setHex(skin);
    });
  }
  document.addEventListener('themechange', (e) => applyTheme(!!(e.detail && e.detail.dark)));
  if (document.body.classList.contains('dark')) applyTheme(true);

  // ---- relight transition: dude flies up to the broken bulb carrying a new one ----
  let relighting = false;
  function shrinkBulb(done) {
    let f = 0; const N = 16;
    const initS = 1;
    function step() {
      f++;
      const k = f / N;
      const s = Math.max(0.001, initS * (1 - k));
      carriedBulb.scale.setScalar(s);
      carriedGlassMat.emissiveIntensity = 0.55 * (1 - k);
      if (carriedLight) carriedLight.intensity = 1.2 * (1 - k);
      if (f < N) requestAnimationFrame(step);
      else {
        carriedBulb.visible = false;
        carriedBulb.scale.setScalar(1);
        carriedGlassMat.emissiveIntensity = 0.55;
        if (carriedLight) carriedLight.intensity = 1.2;
        if (done) done();
      }
    }
    step();
  }

  window.__dudeRelight = function (onAttach, onComplete) {
    if (relighting) return false;
    relighting = true;
    const rig = document.getElementById('dude-rig');
    const bulbBtn = document.getElementById('dm-bulb-btn');
    if (!rig || !bulbBtn) {
      if (onAttach) onAttach();
      if (onComplete) onComplete();
      relighting = false;
      return false;
    }

    // hide the speech bubble for the duration
    if (bubble) bubble.classList.remove('show');

    // raise the carried bulb, swap pose
    carriedBulb.visible = true;
    carriedBulb.scale.setScalar(1);
    carriedGlassMat.emissiveIntensity = 0.55;
    if (carriedLight) carriedLight.intensity = 1.2;
    setPose('carry');

    // compute target offsets so the dude's raised hand reaches the bulb
    const bulbRect = bulbBtn.getBoundingClientRect();
    const rigRect  = rig.getBoundingClientRect();
    const bulbCx = bulbRect.left + bulbRect.width / 2;
    const bulbCy = bulbRect.top  + bulbRect.height * 0.55; // glass sits below the socket
    // dude's raised right hand projects to roughly (rig.left + 176, rig.top + 51)
    // (camera FOV + arm length math; see comments in code)
    const targetRigLeft = bulbCx - 176;
    const targetRigTop  = bulbCy - 51;
    const deltaX = targetRigLeft - rigRect.left;
    const deltaY = targetRigTop  - rigRect.top;

    rig.classList.remove('flying-back');
    rig.style.setProperty('--dude-x', deltaX + 'px');
    rig.style.setProperty('--dude-y', deltaY + 'px');
    rig.style.setProperty('--dude-rot', '-3deg');

    // when arrived: trigger attach, shrink the carried bulb, then fly back
    const FLIGHT_MS = 1200;
    setTimeout(() => {
      if (onAttach) onAttach();
      shrinkBulb(() => {
        // a beat before returning
        setTimeout(() => {
          rig.classList.add('flying-back');
          rig.style.setProperty('--dude-x', '0px');
          rig.style.setProperty('--dude-y', '0px');
          rig.style.setProperty('--dude-rot', '4deg');
          // return to the pose for whatever section we're in
          setPose(SECTION_POSES[activeSection] || 'idle');
          setTimeout(() => {
            rig.style.setProperty('--dude-rot', '0deg');
            rig.classList.remove('flying-back');
            relighting = false;
            if (onComplete) onComplete();
          }, 1100);
        }, 420);
      });
    }, FLIGHT_MS);
    return true;
  };
})();
