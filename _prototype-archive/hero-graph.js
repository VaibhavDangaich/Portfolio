/* 3D knowledge graph hero. drag to rotate, momentum on release. */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const labelsRoot = document.getElementById('graph-labels');
  if (!canvas || !window.THREE) return;

  const THREE = window.THREE;

  // ---- nodes ----
  // type: center | skill | project | exp | win
  const NODES = [
    { id: 'me',         label: 'Vaibhav Dangaich', type: 'center', size: 0.42 },
    // skills
    { id: 'langchain',  label: 'LangChain',        type: 'skill' },
    { id: 'neo4j',      label: 'Neo4j',            type: 'skill' },
    { id: 'kafka',      label: 'Apache Kafka',     type: 'skill' },
    { id: 'nifi',       label: 'Apache NiFi',      type: 'skill' },
    { id: 'python',     label: 'Python',           type: 'skill' },
    { id: 'react',      label: 'React',            type: 'skill' },
    { id: 'next',       label: 'Next.js',          type: 'skill' },
    { id: 'fastapi',    label: 'FastAPI',          type: 'skill' },
    { id: 'docker',     label: 'Docker',           type: 'skill' },
    { id: 'tailwind',   label: 'Tailwind',         type: 'skill' },
    { id: 'cpp',        label: 'C / C++',          type: 'skill' },
    { id: 'llm',        label: 'LLMs · RAG',       type: 'skill' },
    { id: 'strapi',     label: 'Strapi',           type: 'skill' },
    // projects
    { id: 'pushmuse',   label: 'PushMuse',         type: 'project' },
    { id: 'resume',     label: 'AI Resume Builder',type: 'project' },
    // experience
    { id: 'konect',     label: 'Konect U',         type: 'exp' },
    { id: 'bit',        label: 'BIT Mesra',        type: 'exp' },
    // wins
    { id: 'ctf',        label: 'CTF · top 5',      type: 'win' },
    { id: 'dsa',        label: '400+ DSA',         type: 'win' },
  ];

  // ---- edges ----
  // me connects to most things; lateral edges add graph feel
  const EDGES = [
    // me → top-level
    ['me','konect'], ['me','bit'], ['me','pushmuse'], ['me','resume'],
    ['me','ctf'], ['me','dsa'], ['me','llm'], ['me','python'],
    // konect U cluster
    ['konect','langchain'], ['konect','neo4j'], ['konect','kafka'], ['konect','nifi'],
    ['konect','fastapi'], ['konect','python'], ['konect','docker'],
    // resume builder cluster
    ['resume','react'], ['resume','next'], ['resume','tailwind'], ['resume','strapi'],
    // pushmuse cluster
    ['pushmuse','next'], ['pushmuse','llm'],
    // skill-skill
    ['langchain','llm'], ['react','next'], ['neo4j','llm'],
    ['python','fastapi'], ['fastapi','docker'],
    // bit cluster
    ['bit','cpp'], ['bit','dsa'], ['bit','ctf'],
  ];

  // ---- distribute nodes on a sphere (fibonacci) with center pinned ----
  const RADIUS = 2.7;
  const positions = {};
  const nonCenter = NODES.filter(n => n.type !== 'center');
  const N = nonCenter.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  // jitter per cluster to group related things-ish — but fibonacci is fine
  nonCenter.forEach((n, i) => {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    let x = Math.cos(theta) * r;
    let z = Math.sin(theta) * r;
    // pull projects/experience a bit closer; push wins outward
    let radius = RADIUS;
    if (n.type === 'project') radius = RADIUS * 0.88;
    else if (n.type === 'exp') radius = RADIUS * 0.78;
    else if (n.type === 'win') radius = RADIUS * 1.08;
    positions[n.id] = new THREE.Vector3(x * radius, y * radius, z * radius);
  });
  positions['me'] = new THREE.Vector3(0, 0, 0);

  // ---- scene ----
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 7.4);

  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- root group (we rotate this) ----
  const root = new THREE.Group();
  scene.add(root);

  // ---- materials ----
  const COL = {
    skill:   0x1a1a1a,
    project: 0xc2410c,
    exp:     0x3a3835,
    win:     0xc2410c,
    center:  0xc2410c,
    edge:    0x8a8580,
  };

  // ---- nodes ----
  const nodeMeshes = {}; // id -> {mesh, data, labelEl}

  NODES.forEach(n => {
    const isCenter = n.type === 'center';
    const size = isCenter ? 0.34 : (n.type === 'project' ? 0.16 : n.type === 'exp' ? 0.14 : 0.10);
    const geo = new THREE.SphereGeometry(size, 24, 24);
    const mat = new THREE.MeshBasicMaterial({
      color: COL[n.type] || COL.skill,
      transparent: true, opacity: isCenter ? 1 : 0.92,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(positions[n.id]);
    root.add(mesh);

    // outer ring for projects/center
    if (n.type === 'project' || n.type === 'center' || n.type === 'exp') {
      const ringGeo = new THREE.RingGeometry(size * 1.55, size * 1.65, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: COL[n.type], side: THREE.DoubleSide,
        transparent: true, opacity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(positions[n.id]);
      ring.userData.spin = Math.random() * 0.02 + 0.005;
      root.add(ring);
      mesh.userData.ring = ring;
    }

    // label element
    const el = document.createElement('div');
    el.className = 'graph-label ' + (isCenter ? 'center' : n.type);
    el.textContent = n.label;
    labelsRoot.appendChild(el);

    nodeMeshes[n.id] = { mesh, data: n, labelEl: el };
  });

  // ---- edges ----
  const edgeLines = [];
  EDGES.forEach(([a, b]) => {
    const pa = positions[a], pb = positions[b];
    if (!pa || !pb) return;
    const geo = new THREE.BufferGeometry().setFromPoints([pa, pb]);
    const mat = new THREE.LineBasicMaterial({
      color: COL.edge, transparent: true, opacity: 0.28,
    });
    const line = new THREE.Line(geo, mat);
    root.add(line);
    edgeLines.push({ line, a, b });
  });

  // counter
  const counter = document.getElementById('graph-counter');
  if (counter) counter.textContent = `${NODES.length} / ${EDGES.length}`;

  // ---- interaction ----
  let isDragging = false;
  let lastX = 0, lastY = 0;
  let velX = 0, velY = 0; // angular velocity
  let rotX = 0.15, rotY = -0.4;

  const wrap = canvas.parentElement;

  wrap.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastX = e.clientX; lastY = e.clientY;
    velX = 0; velY = 0;
    wrap.setPointerCapture(e.pointerId);
    document.body.classList.add('grabbing');
  });
  wrap.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    rotY += dx * 0.006;
    rotX += dy * 0.006;
    // clamp X
    rotX = Math.max(-1.2, Math.min(1.2, rotX));
    velX = dy * 0.006;
    velY = dx * 0.006;
  });
  const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    try { wrap.releasePointerCapture(e.pointerId); } catch (_) {}
    document.body.classList.remove('grabbing');
  };
  wrap.addEventListener('pointerup', endDrag);
  wrap.addEventListener('pointercancel', endDrag);
  wrap.addEventListener('pointerleave', endDrag);

  // ---- raycast for click-to-scroll ----
  const NODE_TO_SECTION = {
    me: '#about', konect: '#experience', bit: '#education',
    pushmuse: '#projects', resume: '#projects',
    ctf: '#wins', dsa: '#wins',
    langchain: '#stack', neo4j: '#stack', kafka: '#stack', nifi: '#stack',
    python: '#stack', react: '#stack', next: '#stack', fastapi: '#stack',
    docker: '#stack', tailwind: '#stack', cpp: '#stack', llm: '#stack',
    strapi: '#stack',
  };

  const raycaster = new THREE.Raycaster();
  const mouseVec = new THREE.Vector2();
  let pointerDownPos = null;

  wrap.addEventListener('pointerdown', (e) => {
    pointerDownPos = { x: e.clientX, y: e.clientY };
  });
  wrap.addEventListener('pointerup', (e) => {
    if (!pointerDownPos) return;
    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    pointerDownPos = null;
    if (Math.hypot(dx, dy) > 6) return; // it was a drag, not a click

    const rect = canvas.getBoundingClientRect();
    mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseVec, camera);
    const meshes = Object.values(nodeMeshes).map(n => n.mesh);
    const hits = raycaster.intersectObjects(meshes, false);
    if (hits.length) {
      const hit = hits[0].object;
      const id = Object.keys(nodeMeshes).find(k => nodeMeshes[k].mesh === hit);
      const target = NODE_TO_SECTION[id];
      if (target) {
        const el = document.querySelector(target);
        if (el) window.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' });
      }
      // pop animation
      hit.scale.setScalar(1.8);
      setTimeout(() => { hit.scale.setScalar(1); }, 220);
      if (window.__playSound) window.__playSound('pop');
    }
  });

  // hover
  let hovered = null;
  wrap.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseVec, camera);
    const meshes = Object.values(nodeMeshes).map(n => n.mesh);
    const hits = raycaster.intersectObjects(meshes, false);
    const newHover = hits.length ? hits[0].object : null;
    if (newHover !== hovered) {
      if (hovered) hovered.scale.setScalar(1);
      hovered = newHover;
      if (hovered) {
        hovered.scale.setScalar(1.5);
        wrap.style.cursor = 'pointer';
      } else {
        wrap.style.cursor = '';
      }
    }
  });

  // ---- animate / project labels ----
  const tmpVec = new THREE.Vector3();
  function project(v) {
    tmpVec.copy(v).project(camera);
    const rect = canvas.getBoundingClientRect();
    const x = (tmpVec.x * 0.5 + 0.5) * rect.width;
    const y = (-tmpVec.y * 0.5 + 0.5) * rect.height;
    return { x, y, z: tmpVec.z };
  }

  let last = performance.now();
  function tick(now) {
    const dt = Math.min(48, now - last); last = now;

    // idle auto-rotate
    if (!isDragging) {
      rotY += 0.0018;
      // momentum decay
      if (Math.abs(velY) > 0.0001 || Math.abs(velX) > 0.0001) {
        rotY += velY;
        rotX += velX;
        velX *= 0.94; velY *= 0.94;
        rotX = Math.max(-1.2, Math.min(1.2, rotX));
      }
    }
    root.rotation.x = rotX;
    root.rotation.y = rotY;

    // spin rings to face camera-ish (subtle)
    Object.values(nodeMeshes).forEach(({ mesh }) => {
      if (mesh.userData.ring) {
        mesh.userData.ring.lookAt(camera.position);
      }
    });

    // pulse center
    const me = nodeMeshes['me'];
    if (me) {
      const s = 1 + Math.sin(now * 0.0015) * 0.06;
      me.mesh.scale.setScalar(s);
    }

    renderer.render(scene, camera);

    // update labels: project mesh world position to screen
    const worldPos = new THREE.Vector3();
    Object.values(nodeMeshes).forEach(({ mesh, data, labelEl }) => {
      mesh.getWorldPosition(worldPos);
      const p = project(worldPos);
      const visible = p.z < 1;
      // small offset down/right from node
      const offset = data.type === 'center' ? 0 : 12;
      labelEl.style.transform =
        `translate(calc(${p.x}px - 50%), calc(${p.y + offset}px - 50%))`;
      labelEl.style.opacity = visible ? (data.type === 'center' ? 1 : Math.max(0.2, 1 - p.z * 0.6)) : 0;
      labelEl.style.zIndex = Math.round((1 - p.z) * 1000);
    });

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ---- theme switching ----
  const PALETTES = {
    light: { skill: 0x1a1a1a, project: 0xc2410c, exp: 0x3a3835, win: 0xc2410c, center: 0xc2410c, edge: 0x8a8580 },
    dark:  { skill: 0xebe7dc, project: 0xf97316, exp: 0xb5b0a4, win: 0xf97316, center: 0xf97316, edge: 0x4a4540 },
  };
  function applyPalette(p) {
    Object.values(nodeMeshes).forEach(({ mesh, data }) => {
      mesh.material.color.setHex(p[data.type] || p.skill);
      mesh.material.needsUpdate = true;
      if (mesh.userData.ring) {
        mesh.userData.ring.material.color.setHex(p[data.type] || p.skill);
        mesh.userData.ring.material.needsUpdate = true;
      }
    });
    edgeLines.forEach(({ line }) => {
      line.material.color.setHex(p.edge);
      line.material.opacity = p === PALETTES.dark ? 0.35 : 0.28;
      line.material.needsUpdate = true;
    });
  }
  window.__updateGraphTheme = function (isDark) {
    applyPalette(isDark ? PALETTES.dark : PALETTES.light);
  };
  // pick up initial state in case the page restored a preference
  if (document.body.classList.contains('dark')) applyPalette(PALETTES.dark);
})();
