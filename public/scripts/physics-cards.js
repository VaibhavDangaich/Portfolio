/* drag-and-throw physics cards for the projects section.
   each card has a home position; throw it and it flies, bounces off walls,
   then springs back home. */
(function () {
  const stage = document.getElementById('physics-stage');
  if (!stage) return;
  const cards = Array.from(stage.querySelectorAll('.pcard'));
  if (!cards.length) return;

  // physics state per card
  const sim = cards.map((el) => {
    const homeX = parseFloat(el.dataset.x || '0');
    const homeY = parseFloat(el.dataset.y || '0');
    const homeRot = parseFloat(el.dataset.rot || '0');
    return {
      el,
      x: homeX, y: homeY, rot: homeRot,
      vx: 0, vy: 0, vRot: 0,
      homeX, homeY, homeRot,
      dragging: false,
      // pointer tracking
      px: 0, py: 0, // pointer position
      ox: 0, oy: 0, // offset from card center to pointer at grab
      lastPx: 0, lastPy: 0, lastT: 0,
    };
  });

  // sizing
  let bounds = { w: 0, h: 0 };
  function measure() {
    const r = stage.getBoundingClientRect();
    bounds.w = r.width; bounds.h = r.height;
    bounds.left = r.left; bounds.top = r.top;
    // store card half-sizes
    sim.forEach(c => {
      const rect = c.el.getBoundingClientRect();
      c.hw = rect.width / 2;
      c.hh = rect.height / 2;
    });
  }
  measure();
  window.addEventListener('resize', measure);
  // re-measure when fonts settle
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }
  setTimeout(measure, 600);

  function applyTransform(c) {
    // x/y are offsets from center of stage
    c.el.style.transform = `translate(calc(-50% + ${c.x}px), calc(-50% + ${c.y}px)) rotate(${c.rot}deg)`;
  }
  // below this width there is no room to fling a 320px card around, and the
  // absolute layout would just stack every card in the middle. fall back to a
  // plain vertical list and switch the simulation off.
  const narrow = window.matchMedia('(max-width: 1200px)');
  let active = false;

  function applyMode() {
    active = !narrow.matches;
    if (active) {
      stage.classList.remove('static-cards');
      sim.forEach((c) => {
        c.el.style.left = '50%';
        c.el.style.top = '50%';
        // reset to home so a resize never leaves a card parked off-screen
        c.x = c.homeX; c.y = c.homeY; c.rot = c.homeRot;
        c.vx = 0; c.vy = 0; c.vRot = 0;
        applyTransform(c);
      });
      measure();
    } else {
      stage.classList.add('static-cards');
      sim.forEach((c) => {
        c.dragging = false;
        c.el.classList.remove('dragging');
        c.el.style.left = '';
        c.el.style.top = '';
        c.el.style.transform = '';
        c.el.style.zIndex = '';
      });
    }
  }
  applyMode();
  if (narrow.addEventListener) narrow.addEventListener('change', applyMode);
  else narrow.addListener(applyMode); // older Safari

  // drag
  sim.forEach((c) => {
    c.el.addEventListener('pointerdown', (e) => {
      if (!active) return;
      // ignore clicks on links inside the card
      if (e.target.closest('a')) return;
      e.preventDefault();
      const rect = c.el.getBoundingClientRect();
      c.dragging = true;
      c.el.classList.add('dragging');
      c.el.setPointerCapture(e.pointerId);
      // pointer offset from card top-left
      c.ox = e.clientX - rect.left - c.hw;
      c.oy = e.clientY - rect.top - c.hh;
      c.px = e.clientX;
      c.py = e.clientY;
      c.lastPx = e.clientX; c.lastPy = e.clientY; c.lastT = performance.now();
      c.vx = 0; c.vy = 0; c.vRot = 0;
      // bring to front
      cards.forEach((other) => { other.style.zIndex = '1'; });
      c.el.style.zIndex = '10';
      if (window.__playSound) window.__playSound('grab');
    });
    c.el.addEventListener('pointermove', (e) => {
      if (!c.dragging) return;
      const now = performance.now();
      // velocity sample
      const dt = Math.max(1, now - c.lastT);
      c.vx = (e.clientX - c.lastPx) / dt * 16;
      c.vy = (e.clientY - c.lastPy) / dt * 16;
      c.lastPx = e.clientX; c.lastPy = e.clientY; c.lastT = now;
      c.px = e.clientX; c.py = e.clientY;
      // set position directly from pointer
      const stageRect = stage.getBoundingClientRect();
      c.x = (e.clientX - stageRect.left) - stageRect.width / 2 - c.ox;
      c.y = (e.clientY - stageRect.top) - stageRect.height / 2 - c.oy;
      // tilt based on horizontal velocity
      c.rot = c.homeRot + Math.max(-15, Math.min(15, c.vx * 0.6));
      applyTransform(c);
    });
    const release = (e) => {
      if (!c.dragging) return;
      c.dragging = false;
      c.el.classList.remove('dragging');
      try { c.el.releasePointerCapture(e.pointerId); } catch (_) {}
      // give it the velocity from last pointer move
      c.vRot = c.vx * 0.4;
      if (window.__playSound) window.__playSound('release');
    };
    c.el.addEventListener('pointerup', release);
    c.el.addEventListener('pointercancel', release);
  });

  // simulation
  function step() {
    if (!active) { requestAnimationFrame(step); return; }
    sim.forEach((c) => {
      if (!c.dragging) {
        // spring toward home
        const kx = 0.045, ky = 0.045, kr = 0.05;
        const ax = (c.homeX - c.x) * kx;
        const ay = (c.homeY - c.y) * ky;
        const ar = (c.homeRot - c.rot) * kr;
        c.vx += ax;
        c.vy += ay;
        c.vRot += ar;
        // friction
        c.vx *= 0.92; c.vy *= 0.92; c.vRot *= 0.88;
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.vRot;

        // wall collisions
        const halfW = bounds.w / 2 - c.hw - 8;
        const halfH = bounds.h / 2 - c.hh - 8;
        if (c.x > halfW)  { c.x = halfW;  c.vx *= -0.55; c.vRot += c.vy * 0.05; bonk(c); }
        if (c.x < -halfW) { c.x = -halfW; c.vx *= -0.55; c.vRot -= c.vy * 0.05; bonk(c); }
        if (c.y > halfH)  { c.y = halfH;  c.vy *= -0.55; bonk(c); }
        if (c.y < -halfH) { c.y = -halfH; c.vy *= -0.55; bonk(c); }

        applyTransform(c);
      }
    });

    // weak card-card repulsion when both at rest-ish (prevents stack)
    for (let i = 0; i < sim.length; i++) {
      for (let j = i + 1; j < sim.length; j++) {
        const a = sim[i], b = sim[j];
        if (a.dragging || b.dragging) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        const minDist = (a.hw + b.hw) * 0.6;
        if (dist < minDist && dist > 0.01) {
          const f = (minDist - dist) * 0.02;
          const nx = dx / dist, ny = dy / dist;
          a.vx -= nx * f; a.vy -= ny * f;
          b.vx += nx * f; b.vy += ny * f;
        }
      }
    }

    requestAnimationFrame(step);
  }

  let lastBonkTime = 0;
  function bonk(c) {
    const now = performance.now();
    if (now - lastBonkTime > 80 && Math.hypot(c.vx, c.vy) > 1.2) {
      lastBonkTime = now;
      if (window.__playSound) window.__playSound('bonk');
    }
  }

  requestAnimationFrame(step);
})();
