/* UI layer: custom cursor, scroll reveals, text scramble, web audio. */
(function () {
  // ---------- custom cursor ----------
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let tx = mx, ty = my;

  if (cursor && trail) {
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    function tick() {
      tx += (mx - tx) * 0.18;
      ty += (my - ty) * 0.18;
      trail.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // hover state on anything interactive
    const HOVER_SEL = 'a, button, [data-cursor], .pcard, .skill-col li, .fact, .exp-row, .edu-row, .ach-card';
    document.addEventListener('pointerover', (e) => {
      if (e.target.closest && e.target.closest(HOVER_SEL)) {
        cursor.classList.add('hover');
      }
    });
    document.addEventListener('pointerout', (e) => {
      if (e.target.closest && e.target.closest(HOVER_SEL)) {
        cursor.classList.remove('hover');
      }
    });
    document.addEventListener('pointerdown', () => cursor.classList.add('click'));
    document.addEventListener('pointerup', () => cursor.classList.remove('click'));

    // hide native cursor on inputs we restore manually if any added later
  }

  // ---------- scroll reveals (IntersectionObserver) ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        // stagger children
        if (entry.target.hasAttribute('data-reveal-stagger')) {
          Array.from(entry.target.children).forEach((child, i) => {
            child.style.transitionDelay = (i * 60) + 'ms';
          });
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach((el) => io.observe(el));

  // ---------- text scramble on hero name ----------
  const scrambleEls = document.querySelectorAll('[data-scramble]');
  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/?';
  scrambleEls.forEach((el) => {
    const original = el.textContent;
    function scramble() {
      const len = original.length;
      const total = 28; // frames
      let frame = 0;
      const id = setInterval(() => {
        let out = '';
        for (let i = 0; i < len; i++) {
          // reveal letters left-to-right
          if (i < (frame / total) * len) out += original[i];
          else if (original[i] === ' ') out += ' ';
          else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        el.textContent = out;
        frame++;
        if (frame > total) { el.textContent = original; clearInterval(id); }
      }, 30);
    }
    // initial run after a beat
    setTimeout(scramble, 400);
    el.addEventListener('pointerenter', scramble);
  });

  // ---------- web audio (subtle clicks) ----------
  let audioCtx = null;
  let soundOn = false;
  const toggle = document.getElementById('sound-toggle');
  const soundLabel = document.getElementById('sound-label');

  function ensureCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  function blip({ freq = 440, dur = 0.05, type = 'sine', gain = 0.04, slide = 0 } = {}) {
    if (!soundOn || !audioCtx) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  window.__playSound = function (kind) {
    if (!soundOn) return;
    ensureCtx();
    switch (kind) {
      case 'hover': return blip({ freq: 880, dur: 0.04, type: 'sine', gain: 0.015 });
      case 'click': return blip({ freq: 520, dur: 0.06, type: 'triangle', gain: 0.03, slide: -180 });
      case 'pop':   return blip({ freq: 720, dur: 0.09, type: 'triangle', gain: 0.04, slide: 360 });
      case 'grab':  return blip({ freq: 360, dur: 0.05, type: 'sine', gain: 0.03 });
      case 'release': return blip({ freq: 560, dur: 0.06, type: 'sine', gain: 0.03, slide: 220 });
      case 'bonk':  return blip({ freq: 220, dur: 0.07, type: 'square', gain: 0.025, slide: -100 });
    }
  };

  // wire hover/click sounds globally
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest && e.target.closest('a, button, .pcard, .fact, .ach-card, .exp-row')) {
      window.__playSound('hover');
    }
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('a, button')) {
      window.__playSound('click');
    }
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      soundOn = !soundOn;
      ensureCtx();
      toggle.classList.toggle('on', soundOn);
      toggle.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      if (soundLabel) soundLabel.textContent = soundOn ? 'SOUND · ON' : 'SOUND · OFF';
      if (soundOn) window.__playSound('pop');
    });
  }

  // ---------- smooth-scroll nav links ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 24, behavior: 'smooth' });
      }
    });
  });

  // ---------- magnetic-ish nav hover ----------
  document.querySelectorAll('.topbar .nav a').forEach((a) => {
    a.addEventListener('pointermove', (e) => {
      const rect = a.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
      a.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    a.addEventListener('pointerleave', () => { a.style.transform = ''; });
  });

  // ---------- year ----------
  // (kept inline in markup)
})();
