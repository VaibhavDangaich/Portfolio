/* Dark mode toggle with a hanging-bulb shatter animation.
   Click the lit bulb → arrow fires in from the right → impact at the bulb
   → glass shatters into flying shards → page transitions to dark mode.
   Click the broken bulb in dark mode → a halo burst relights the bulb and
   the page transitions back to light. */
(function () {
  const rig       = document.getElementById('dm-rig');
  const pendulum  = document.getElementById('dm-pendulum');
  const btn       = document.getElementById('dm-bulb-btn');
  const arrow     = document.getElementById('dm-arrow');
  const shardsBox = document.getElementById('dm-shards');
  const flash     = document.getElementById('dm-flash');
  const hint      = document.getElementById('dm-hint');
  if (!rig || !btn || !arrow) return;

  let isDark = false;
  let animating = false;

  // ---------- helpers ----------
  function getBulbCenter() {
    // we want the screen position of the bulb's glass center
    const btnRect = btn.getBoundingClientRect();
    return {
      x: btnRect.left + btnRect.width / 2,
      y: btnRect.top + btnRect.height * 0.55, // glass sits below the socket
    };
  }

  function setFlashOrigin() {
    const c = getBulbCenter();
    flash.style.setProperty('--fx', c.x + 'px');
    flash.style.setProperty('--fy', c.y + 'px');
  }

  function spawnShards(opts = {}) {
    const c = getBulbCenter();
    const COUNT = 16;
    const inward = opts.inward === true;
    const startPos = inward
      ? () => randomEdgePoint(c, 220)
      : () => ({ x: c.x, y: c.y });
    const targetPos = inward
      ? () => ({ x: c.x, y: c.y })
      : null;

    const shards = [];
    for (let i = 0; i < COUNT; i++) {
      const s = document.createElement('div');
      s.className = 'dm-shard';
      // random shard triangle SVG
      const w = 6 + Math.random() * 14;
      const h = 6 + Math.random() * 14;
      const fill = Math.random() < 0.7
        ? 'rgba(255,219,145,0.85)'  // glass tint
        : 'rgba(255,255,255,0.7)';  // bright glint
      const stroke = '#1a1a1a';
      s.style.width = w + 'px';
      s.style.height = h + 'px';
      s.innerHTML = `
        <svg viewBox="0 0 20 20">
          <polygon points="${randomTriangle()}" fill="${fill}" stroke="${stroke}" stroke-width="0.6" />
        </svg>`;

      const sp = startPos();
      s.style.left = sp.x + 'px';
      s.style.top  = sp.y + 'px';
      shardsBox.appendChild(s);

      let vx, vy;
      if (inward) {
        const tp = targetPos();
        // velocity heading toward the bulb
        const dx = tp.x - sp.x, dy = tp.y - sp.y;
        const dist = Math.hypot(dx, dy);
        const speed = 6 + Math.random() * 2;
        vx = (dx / dist) * speed * 6;
        vy = (dy / dist) * speed * 6;
      } else {
        // outward: roughly radial but mostly sideways/downward post-impact
        const angle = (-Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 1.4;
        const speed = 6 + Math.random() * 10;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed - 2; // a bit of upward kick
      }

      shards.push({
        el: s,
        x: sp.x, y: sp.y,
        vx, vy,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 24,
        life: 0,
        maxLife: inward ? 32 : 90, // frames at ~60fps
        inward,
      });
    }

    // animate
    function step() {
      let alive = 0;
      shards.forEach((p) => {
        if (p.dead) return;
        alive++;
        p.life++;
        if (!p.inward) {
          p.vy += 0.45; // gravity
          p.vx *= 0.995;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        const fade = p.inward
          ? 1 - p.life / p.maxLife
          : Math.max(0, 1 - p.life / p.maxLife);
        p.el.style.transform =
          `translate(-50%, -50%) translate(${p.x - parseFloat(p.el.style.left)}px, ${p.y - parseFloat(p.el.style.top)}px) rotate(${p.rot}deg)`;
        // simpler: just move via top/left, but transform is cheaper. use absolute positioning:
        p.el.style.left = p.x + 'px';
        p.el.style.top  = p.y + 'px';
        p.el.style.transform = `translate(-50%, -50%) rotate(${p.rot}deg)`;
        p.el.style.opacity = String(fade);
        if (p.life >= p.maxLife) {
          p.dead = true;
          p.el.remove();
        }
      });
      if (alive > 0) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function randomTriangle() {
    // a sharp glass-shard triangle inside 20x20
    const pts = [];
    for (let i = 0; i < 3; i++) {
      pts.push((Math.random() * 20).toFixed(1) + ',' + (Math.random() * 20).toFixed(1));
    }
    return pts.join(' ');
  }
  function randomEdgePoint(center, dist) {
    const a = Math.random() * Math.PI * 2;
    return { x: center.x + Math.cos(a) * dist, y: center.y + Math.sin(a) * dist };
  }

  // ---------- transitions ----------
  function dispatchThemeChange(dark) {
    if (typeof window.__updateGraphTheme === 'function') {
      window.__updateGraphTheme(dark);
    }
    document.dispatchEvent(new CustomEvent('themechange', { detail: { dark } }));
  }

  function toDark() {
    if (animating) return;
    animating = true;
    rig.classList.add('animating');

    // reset arrow then play
    arrow.classList.remove('shoot', 'stuck');
    // force reflow so the animation replays
    void arrow.offsetWidth;
    arrow.classList.add('shoot');

    if (window.__playSound) window.__playSound('grab');

    // impact happens at the end of the shoot animation (~380ms)
    const IMPACT_MS = 360;
    setTimeout(() => {
      // bang!
      setFlashOrigin();
      flash.classList.remove('bang'); void flash.offsetWidth;
      flash.classList.add('bang');
      // shatter immediately
      rig.classList.add('shattered');
      spawnShards({ inward: false });
      // jolt the pendulum
      pendulum.classList.remove('jolt'); void pendulum.offsetWidth;
      pendulum.classList.add('jolt');
      // arrow continues a beat then drops
      arrow.classList.remove('shoot');
      void arrow.offsetWidth;
      arrow.classList.add('stuck');
      if (window.__playSound) {
        window.__playSound('bonk');
        setTimeout(() => window.__playSound('pop'), 30);
      }

      // page goes dark 60ms after impact (let the flash peak first)
      setTimeout(() => {
        document.body.classList.add('dark');
        isDark = true;
        btn.setAttribute('aria-pressed', 'true');
        if (hint) hint.textContent = 'click · let there be light';
        dispatchThemeChange(true);
      }, 60);

      // clean up: clear the shattered class so dark-mode styles can take over
      setTimeout(() => {
        rig.classList.remove('shattered');
        rig.classList.remove('animating');
        arrow.classList.remove('stuck');
        animating = false;
      }, 1100);
    }, IMPACT_MS);
  }

  function toLight() {
    if (animating) return;
    animating = true;
    rig.classList.add('animating');

    // If the dude avatar is available, hand-deliver the new bulb
    if (typeof window.__dudeRelight === 'function') {
      if (window.__playSound) window.__playSound('grab');
      const started = window.__dudeRelight(
        () => {
          // onAttach: the dude's hand has reached the socket
          rig.classList.add('relight');
          document.body.classList.remove('dark');
          isDark = false;
          btn.setAttribute('aria-pressed', 'false');
          if (hint) hint.textContent = 'click · break the light';
          dispatchThemeChange(false);
          setFlashOrigin();
          flash.classList.remove('bang'); void flash.offsetWidth;
          flash.classList.add('bang');
          pendulum.classList.remove('jolt'); void pendulum.offsetWidth;
          pendulum.classList.add('jolt');
          if (window.__playSound) window.__playSound('pop');
        },
        () => {
          // onComplete: the dude is home; release the lock
          rig.classList.remove('relight');
          rig.classList.remove('animating');
          animating = false;
        }
      );
      if (started) return;
    }

    // fallback: shards-fly-inward animation (when dude isn't available)
    spawnShards({ inward: true });
    if (window.__playSound) window.__playSound('release');

    setTimeout(() => {
      rig.classList.add('relight');
      document.body.classList.remove('dark');
      isDark = false;
      btn.setAttribute('aria-pressed', 'false');
      if (hint) hint.textContent = 'click · break the light';
      dispatchThemeChange(false);
      // tiny jolt as it relights
      pendulum.classList.remove('jolt'); void pendulum.offsetWidth;
      pendulum.classList.add('jolt');
      if (window.__playSound) window.__playSound('pop');
    }, 360);

    setTimeout(() => {
      rig.classList.remove('relight');
      rig.classList.remove('animating');
      animating = false;
    }, 1200);
  }

  // ---------- wire it up ----------
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (animating) return;
    if (!isDark) toDark();
    else toLight();
  });

  // optional: keyboard shortcut (D toggles)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'd' || e.key === 'D') {
      if (e.target && e.target.matches && e.target.matches('input, textarea')) return;
      btn.click();
    }
  });
})();
