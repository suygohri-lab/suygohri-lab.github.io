/* =========================================================
   Companions — Pip the scientist and Minerva the owl
   Plain JavaScript, no libraries, no build step, no inline code (CSP-safe).

   Use on any page:
     <link rel="stylesheet" href="/companions/companions.css">
     <script src="/companions/companions.js" defer></script>

   Optional page hooks (all data-* attributes, so no inline scripts are needed):
     [data-companion-perch]          the header Minerva perches on (on its bottom edge)
     [data-companion-perch-after]    she sits to the right of this element…
     [data-companion-perch-before]   …and to the left of the first visible one of these
     [data-companion-item]           things she can fly to / you can drop her on
                                     (data-companion-title="…" names it in her bubble)
     <script type="application/json" id="companion-data">
       { "page": "Home", "siteName": "…", "tips": ["…"], "ownerTips": ["…"] }
     </script>                       tips for clicks (ownerTips only shown on localhost)
     #live-status (role="status")    where real outcomes are announced (created if missing)
     html[data-reduced-motion]       set by the page's Animations setting; without one,
                                     the device's prefers-reduced-motion is used

   Events: the page tells the characters what happened with
     document.dispatchEvent(new CustomEvent("companion", { detail: { type, target, title, announce } }))
   types: opened, copied, copy-failed, placeholder, theme, paused, resumed, menu, saved, error.
   `announce` (optional) is read to screen readers once.

   1. Setup & helpers   2. Markup   3. Shared interaction   4. Pip
   5. Minerva   6. Page events   7. Loop & sleep   8. Boot
   ========================================================= */
(() => {
  'use strict';
  if (window.Companions) return;

  /* ---------- 1. Setup & helpers ---------- */
  const SLEEP_AFTER_MS = 60000;
  const root = document.documentElement;
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  /** The page's Animations setting wins; without one, follow the device. */
  const motionReduced = () => (root.hasAttribute('data-motion') ? root.hasAttribute('data-reduced-motion') : reduceQuery.matches);

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const rnd = (lo, hi) => lo + Math.random() * (hi - lo);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const shorten = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  function readData() {
    const node = document.getElementById('companion-data');
    if (!node) return {};
    try { return JSON.parse(node.textContent || '{}'); } catch (err) { return {}; }
  }
  const data = readData();

  /** Screen readers hear real outcomes here once; the characters' chatter stays visual. */
  function announce(text) {
    if (!text) return;
    let region = document.getElementById('live-status');
    if (!region) {
      region = document.createElement('p');
      region.id = 'live-status';
      region.setAttribute('role', 'status');
      region.className = 'sr-only';
      document.body.append(region);
    }
    region.textContent = '';
    setTimeout(() => { region.textContent = text; }, 60);
  }

  /** Something useful about the page, for a click. Owner reminders only appear on localhost. */
  let lastTip = '';
  function ownerReminders() {
    const reminders = [...(data.ownerTips || [])];
    const placeholders = document.querySelectorAll('a[href="#"]').length;
    if (placeholders) reminders.push(`Reminder: ${placeholders} link${placeholders === 1 ? ' is' : 's are'} still “#” placeholders on this page.`);
    return reminders;
  }
  function pickTip() {
    const pool = [...(data.tips || []), ...(isLocal ? ownerReminders() : [])];
    if (!pool.length) pool.push('Have a look around!');
    const fresh = pool.filter((t) => t !== lastTip);
    lastTip = pick(fresh.length ? fresh : pool);
    return lastTip;
  }

  /* ---------- 2. Markup (built here so pages only need the two tags) ---------- */
  const PIP_SVG = `
    <svg class="c-svg" viewBox="0 0 80 120" overflow="visible" aria-hidden="true" focusable="false">
      <ellipse class="shadow" cx="40" cy="117" rx="20" ry="2.8"/>
      <g class="arm arm-back"><rect class="coat-shade ol" x="47" y="52" width="9" height="28" rx="4.5"/><circle class="skin ol" cx="51.5" cy="80" r="4"/></g>
      <g class="leg leg-back"><rect class="trousers ol" x="41" y="88" width="8" height="26" rx="4"/><ellipse class="shoe ol" cx="47" cy="114.5" rx="7" ry="3.2"/></g>
      <g class="leg leg-front"><rect class="trousers ol" x="31" y="88" width="8" height="26" rx="4"/><ellipse class="shoe ol" cx="37" cy="114.5" rx="7" ry="3.2"/></g>
      <g class="torso">
        <path class="coat ol" d="M26 52 Q40 46 54 52 L58 94 Q40 98 22 94 Z"/>
        <path class="shirt" d="M35 49 L40 60 L45 49 Z"/>
        <path class="ol" fill="none" d="M40 60 L40 95"/>
        <rect class="pocket ol" x="44" y="66" width="8" height="7" rx="1.5"/>
        <rect class="pen" x="46" y="62" width="1.8" height="7" rx=".9"/>
      </g>
      <g class="head">
        <rect class="skin" x="36" y="40" width="8" height="9" rx="3"/>
        <circle class="skin ol" cx="40" cy="30" r="13"/>
        <path class="hair ol" d="M27 29 C26 17 34 13 41 14 C49 14 55 19 54 28 C51 23 46 21 41 22 C36 23 31 25 27 29 Z"/>
        <circle class="hair" cx="29" cy="20" r="4"/><circle class="hair" cx="36" cy="15" r="4.5"/>
        <circle class="hair" cx="45" cy="15" r="4.5"/><circle class="hair" cx="52" cy="21" r="3.5"/>
        <g class="eyes"><circle cx="41" cy="31" r="1.6"/><circle cx="49.5" cy="31" r="1.6"/></g>
        <path class="eyes-closed" d="M38.5 31.5 q2.5 2 5 0 M47 31.5 q2.5 2 5 0"/>
        <path class="eyes-happy" d="M38.5 32.5 q2.5 -2.8 5 0 M47 32.5 q2.5 -2.8 5 0"/>
        <g class="glasses"><circle cx="41" cy="31" r="4.3"/><circle cx="49.5" cy="31" r="4.3"/><path d="M36.7 30 L29 28"/></g>
        <circle class="cheek" cx="52" cy="35.5" r="2"/>
        <path class="smile" d="M44 37 q3 2.2 6 0"/>
      </g>
      <g class="arm arm-front">
        <rect class="coat ol" x="26" y="52" width="9" height="28" rx="4.5"/><circle class="skin ol" cx="30.5" cy="80" r="4"/>
        <g class="clipboard">
          <rect class="board ol" x="22" y="72" width="16" height="20" rx="2"/><rect class="sheet" x="24.5" y="76" width="11" height="14"/>
          <rect class="clip" x="27" y="70.5" width="6" height="3" rx="1"/><path class="sheet-lines" d="M26.5 80h7 M26.5 83h7 M26.5 86h5"/>
        </g>
      </g>
    </svg>`;

  const OWL_SVG = `
    <svg class="c-svg" viewBox="0 0 60 64" overflow="visible" aria-hidden="true" focusable="false">
      <g class="wing wing-l"><ellipse class="owl-wing ol" cx="13" cy="38" rx="7" ry="15"/></g>
      <g class="wing wing-r"><ellipse class="owl-wing ol" cx="47" cy="38" rx="7" ry="15"/></g>
      <path class="owl-body ol" d="M30 12 C46 12 50 26 49 40 C48 54 40 60 30 60 C20 60 12 54 11 40 C10 26 14 12 30 12 Z"/>
      <path class="owl-tuft ol" d="M15 18 L13 6 L23 13 Z M45 18 L47 6 L37 13 Z"/>
      <ellipse class="owl-belly ol" cx="30" cy="44" rx="12" ry="13"/>
      <path class="owl-chevrons" d="M24 40 l3 2.5 3-2.5 3 2.5 3-2.5 M24 46 l3 2.5 3-2.5 3 2.5 3-2.5 M26 52 l2 2 2-2 2 2 2-2"/>
      <g class="owl-face">
        <circle class="owl-disc" cx="22" cy="26" r="9"/><circle class="owl-disc" cx="38" cy="26" r="9"/>
        <g class="owl-eyes">
          <circle class="owl-eye-white ol" cx="22" cy="26" r="6"/><circle class="owl-eye-white ol" cx="38" cy="26" r="6"/>
          <circle class="owl-pupil" cx="23" cy="26.5" r="3.2"/><circle class="owl-pupil" cx="39" cy="26.5" r="3.2"/>
          <circle class="owl-glint" cx="24.2" cy="25.2" r="1"/><circle class="owl-glint" cx="40.2" cy="25.2" r="1"/>
        </g>
        <path class="owl-eyes-closed" d="M17 27 q5 3 10 0 M33 27 q5 3 10 0"/>
        <path class="owl-eyes-happy" d="M17 28 q5 -5 10 0 M33 28 q5 -5 10 0"/>
        <path class="owl-beak ol" d="M27.5 31 L32.5 31 L30 36 Z"/>
      </g>
      <path class="owl-feet" d="M24 59 v4 M27 59 v4 M33 59 v4 M36 59 v4"/>
    </svg>`;

  function buildCharacter(kind, label, svg) {
    const host = document.createElement('div');
    host.className = `companion c-${kind}`;
    host.innerHTML = `
      <p class="c-bubble" aria-hidden="true"></p>
      <span class="c-zzz" aria-hidden="true"><span>z</span><span>z</span><span>Z</span></span>
      <button class="c-hit" type="button" aria-label="${label}">${kind === 'pip' ? `<span class="c-flip">${svg}</span>` : svg}</button>`;
    document.body.append(host);
    return host;
  }

  /* ---------- 3. Shared interaction ---------- */
  // Layout reads happen once per frame, before anything moves, so moving never forces a reflow.
  const frame = { header: null, perch: null, now: 0 };
  let lastMeasure = 0;

  // Where the pointer is, so eyes can follow it. A finger isn't there between touches,
  // so after a touch the eyes look back ahead after a moment.
  const pointer = { x: 0, y: 0, active: false };
  let touchLookTimer = 0;
  const followPointer = (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
    if (e.pointerType !== 'mouse') {
      clearTimeout(touchLookTimer);
      touchLookTimer = setTimeout(() => { pointer.active = false; }, 2500);
    }
  };
  window.addEventListener('pointermove', followPointer, { passive: true });
  window.addEventListener('pointerdown', followPointer, { passive: true });
  document.addEventListener('mouseout', (e) => { if (!e.relatedTarget) pointer.active = false; });

  /** Nudge pupils toward the pointer. `eyes` = { els, key }. */
  function lookAt(eyes, fromX, fromY, reach, mirror = 1) {
    let dx = 0;
    let dy = 0;
    if (pointer.active) {
      const vx = pointer.x - fromX;
      const vy = pointer.y - fromY;
      const d = Math.hypot(vx, vy) || 1;
      const k = Math.min(1, d / 140);
      dx = (vx / d) * reach * k * mirror;
      dy = (vy / d) * reach * k;
    }
    const key = `${dx.toFixed(2)},${dy.toFixed(2)}`;
    if (eyes.key === key) return;
    eyes.key = key;
    eyes.els.forEach((n) => { n.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`; });
  }

  /** Briefly add a class for a reaction (a hop, a squint, a wiggle). */
  function pulse(node, cls, ms) {
    node.classList.remove(cls);
    void node.offsetWidth; // restart its animation (an event-time read, never inside the frame loop)
    node.classList.add(cls);
    clearTimeout(node[`_${cls}`]);
    node[`_${cls}`] = setTimeout(() => node.classList.remove(cls), ms);
  }

  function setBubble(bubble, text) {
    bubble.textContent = text;
    bubble.dataset.w = String(bubble.offsetWidth); // measured once per message, not every frame
  }
  function bubbleShift(bubble, x) {
    const half = Number(bubble.dataset.w || 0) / 2;
    let shift = 0;
    if (x - half < 12) shift = 12 - (x - half);
    else if (x + half > window.innerWidth - 12) shift = window.innerWidth - 12 - (x + half);
    bubble.style.setProperty('--shift', `${shift.toFixed(1)}px`);
  }

  /** Press and drag a character; a plain click still counts as a click. On touch, a long press tickles. */
  function makeDraggable(handle, { onStart, onMove, onDrop }) {
    let drag = null;
    let justDragged = false;
    let pressTimer = 0;
    handle.addEventListener('contextmenu', (e) => e.preventDefault());
    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, moved: false, pressed: false };
      try { handle.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
      clearTimeout(pressTimer);
      if (e.pointerType !== 'mouse') {
        pressTimer = setTimeout(() => {
          if (!drag || drag.moved) return;
          drag.pressed = true;
          handle.dispatchEvent(new CustomEvent('c-tickle'));
        }, 500);
      }
    });
    handle.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.moved) {
        if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
        clearTimeout(pressTimer);
        drag.moved = true;
        handle.classList.add('is-dragging');
        onStart(e.clientX, e.clientY);
      }
      onMove(e.clientX, e.clientY);
    });
    const end = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      clearTimeout(pressTimer);
      if (drag.pressed || drag.moved) {
        justDragged = true;
        setTimeout(() => { justDragged = false; }, 0);
      }
      if (drag.moved) {
        handle.classList.remove('is-dragging');
        onDrop(e.clientX, e.clientY);
      }
      drag = null;
    };
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
    handle.addEventListener('click', (e) => {
      if (justDragged) { e.stopImmediatePropagation(); e.preventDefault(); }
    }, true);
  }

  /** Notice the mouse arriving, and spot a back-and-forth rub (a tickle). */
  function watchHover(handle, { onNotice, onTickle }) {
    let lastX = null;
    let lastDir = 0;
    let flips = [];
    let noticeAt = 0;
    let tickleAt = 0;
    handle.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || e.buttons) return;
      const now = performance.now();
      if (now - noticeAt > 5000) { noticeAt = now; onNotice(); }
    });
    handle.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || e.buttons) return;
      const now = performance.now();
      if (lastX !== null) {
        const dir = Math.sign(e.clientX - lastX);
        if (dir && dir !== lastDir) { flips.push(now); lastDir = dir; }
      }
      lastX = e.clientX;
      flips = flips.filter((t) => now - t < 1200);
      if (flips.length >= 5 && now - tickleAt > 4000) {
        tickleAt = now;
        flips = [];
        onTickle();
      }
    });
    handle.addEventListener('pointerleave', () => { lastX = null; });
    handle.addEventListener('c-tickle', () => {
      const now = performance.now();
      if (now - tickleAt > 1500) { tickleAt = now; onTickle(); }
    });
  }

  /** Things Minerva can land on: [data-companion-item] elements. */
  const itemUnder = (x, y, self) => {
    const hit = document.elementsFromPoint(x, y).find((n) => !self.contains(n) && n.closest && n.closest('[data-companion-item]'));
    return hit ? hit.closest('[data-companion-item]') : null;
  };
  const itemTitle = (el) => (el && (el.dataset.companionTitle || '').trim()) || '';

  const INTERACTIVE = 'a[href], button, input, select, textarea, summary, label, [role="button"], [tabindex]:not([tabindex="-1"])';

  /* ---------- 4. Pip, the scientist ---------- */
  /**
   * Walks the bottom edge, reads his clipboard, cheers on good news and dozes off.
   * Hover: waves. Rub or long-press: tickled. Drag: carried, then drops with a bounce. Click: a tip.
   */
  const Pip = (() => {
    const host = buildCharacter('pip', 'Say hello to Pip, the scientist', PIP_SVG);
    const flip = host.querySelector('.c-flip');
    const bubble = host.querySelector('.c-bubble');
    const button = host.querySelector('.c-hit');
    const eyes = { els: [...host.querySelectorAll('.eyes')], key: '' };
    const SPEED = { walk: 66, hurry: 180 };
    const GRAVITY = 2400;
    const me = {
      x: -50, y: 0, tx: 0, v: 0, vy: 0, facing: 1, moving: false, pace: 'walk', onArrive: null,
      state: 'walking', sleeping: false, carried: false, falling: false, dropFrom: 0, ghost: false,
    };
    let idleTimer = 0;
    let bubbleTimer = 0;

    const small = () => window.innerWidth < 640;
    const height = () => (small() ? 75 : 90);
    const ground = () => window.innerHeight - 4;
    const free = () => !me.carried && !me.falling;

    /** Stay under the page's content column on wide screens; use the full width on phones. */
    function range() {
      const w = window.innerWidth;
      if (w >= 1200) {
        const side = (w - 1152) / 2;
        return { min: side + 40, max: w - side - 40 };
      }
      return { min: 36, max: w - 36 };
    }

    function setState(next) {
      me.state = next;
      host.dataset.state = next;
      host.dataset.pace = me.pace;
    }
    function scheduleIdle(ms) {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(nextIdle, ms);
    }
    function walkTo(x, pace, onArrive) {
      clearTimeout(idleTimer);
      const r = range();
      me.tx = clamp(x, r.min, r.max);
      me.pace = pace;
      me.moving = true;
      me.onArrive = onArrive || null;
      setState('walking');
    }
    function read(ms) {
      me.moving = false;
      setState('reading');
      scheduleIdle(ms);
    }
    function nextIdle() {
      if (me.sleeping || !free()) return;
      const r = range();
      if (Math.random() < 0.65) {
        let x = me.x;
        for (let tries = 0; tries < 10 && Math.abs(x - me.x) < 120; tries++) x = rnd(r.min, r.max);
        walkTo(x, 'walk', () => read(rnd(4000, 8000)));
      } else {
        read(rnd(3000, 6000));
      }
    }
    function say(text, ms = 3000) {
      setBubble(bubble, text);
      bubbleShift(bubble, me.x);
      bubble.classList.add('is-visible');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => bubble.classList.remove('is-visible'), ms);
    }
    /** A short pose (wave, think, worry…) before going back to idling. */
    function pose(name, ms, text) {
      if (!free()) { if (text) say(text, 2800); return; }
      wake(true);
      me.moving = false;
      setState(name);
      if (text) say(text, Math.max(ms, 2600));
      scheduleIdle(ms);
    }
    function sleep() {
      if (me.sleeping || !free()) return;
      me.sleeping = true;
      me.moving = false;
      clearTimeout(idleTimer);
      bubble.classList.remove('is-visible');
      setState('sleeping');
    }
    function wake(quiet) {
      if (!me.sleeping) return;
      me.sleeping = false;
      setState('reading');
      if (!quiet) say('Oh! I was just… resting my eyes.', 2600);
      scheduleIdle(2000);
    }
    function greeting() {
      const h = new Date().getHours();
      const hello = h < 5 ? 'Up late?' : h < 12 ? 'Good morning!' : h < 17 ? 'Good afternoon!' : h < 22 ? 'Good evening!' : 'Burning the midnight oil?';
      return `${hello} ${data.pipGreeting || 'Click me for a tip.'}`;
    }
    function land() {
      me.falling = false;
      me.vy = 0;
      me.y = ground();
      const fell = ground() - me.dropFrom;
      setState('reading');
      say(fell > 240 ? 'Oof! Gentle, please.' : pick(['Thanks for the lift!', 'Ah, a new spot.', 'Nice view from up there.']), 2600);
      const r = range();
      if (me.x < r.min || me.x > r.max) walkTo(me.x, 'walk', () => read(4000));
      else scheduleIdle(4000);
    }

    /** Measure phase: is Pip standing over a link or button? Then he turns see-through. */
    function measure() {
      if (me.carried) { me.ghost = false; return; }
      const top = me.y - height();
      let over = false;
      for (const y of [top + 12, top + height() / 2, me.y - 10]) {
        const hit = document.elementsFromPoint(me.x, y).find((n) => !host.contains(n));
        if (hit && hit.closest(INTERACTIVE)) { over = true; break; }
      }
      me.ghost = over;
    }

    function tick(dt) {
      const reduced = motionReduced();
      if (me.carried) {
        // position comes from the drag
      } else if (me.falling) {
        if (reduced) land();
        else {
          me.vy += GRAVITY * dt;
          me.y += me.vy * dt;
          if (me.y >= ground()) {
            if (me.vy > 520) { me.y = ground(); me.vy = -me.vy * 0.28; } // a little bounce
            else land();
          }
        }
      } else {
        me.y = ground();
        if (me.moving) {
          if (reduced) me.x = me.tx; // arrive at once
          const dx = me.tx - me.x;
          const dist = Math.abs(dx);
          me.v += (SPEED[me.pace] - me.v) * Math.min(1, dt * 3);
          const step = Math.min(me.v, dist * 3 + 20) * dt;
          if (dist > 1) me.facing = dx > 0 ? 1 : -1;
          if (dist <= Math.max(step, 1)) {
            me.x = me.tx;
            me.moving = false;
            me.v = 0;
            const done = me.onArrive;
            me.onArrive = null;
            if (done) done(); else read(4000);
          } else {
            me.x += Math.sign(dx) * step;
          }
        } else if (!me.sleeping) {
          const r = range(); // keep inside the range when the window is resized
          if (me.x < r.min - 1 || me.x > r.max + 1) me.x += (clamp(me.x, r.min, r.max) - me.x) * Math.min(1, dt * 6);
        }
      }
      host.classList.toggle('is-ghost', me.ghost);
      host.style.transform = `translate3d(${me.x.toFixed(1)}px, ${me.y.toFixed(1)}px, 0)`;
      flip.style.transform = `scaleX(${me.facing})`;
      if (!me.sleeping) lookAt(eyes, me.x + 4 * me.facing, me.y - height() * 0.73, 1.7, me.facing);
      if (bubble.classList.contains('is-visible')) bubbleShift(bubble, me.x);
    }

    function init() {
      me.y = ground();
      button.addEventListener('click', () => {
        if (me.sleeping) { wake(false); return; }
        const tip = pickTip();
        pose('thinking', 4600, tip);
        announce(tip); // you asked, so screen readers hear the answer too
      });
      watchHover(button, {
        onNotice: () => {
          if (me.sleeping || me.moving || !free()) return;
          pose('waving', 1600, Math.random() < 0.5 ? pick(['Oh, hi!', 'Hello there!', 'Need a hand?']) : '');
        },
        onTickle: () => {
          if (me.sleeping) { wake(false); return; }
          pose('tickled', 1800, pick(['Hey, that tickles!', 'Ha! Stop it!', 'Hee hee, I’m working!']));
        },
      });
      makeDraggable(button, {
        onStart: () => {
          me.sleeping = false;
          me.moving = false;
          me.falling = false;
          me.carried = true;
          clearTimeout(idleTimer);
          setState('carried');
          say(pick(['Whoa! Where are we going?', 'Up we go!', 'Careful with the clipboard!']), 2400);
        },
        onMove: (x, y) => {
          if (Math.abs(x - me.x) > 0.5) me.facing = x > me.x ? 1 : -1;
          me.x = clamp(x, 30, window.innerWidth - 30);
          me.y = Math.min(ground(), y + height() * 0.9); // held by the head
        },
        onDrop: () => {
          me.carried = false;
          me.falling = true;
          me.vy = 0;
          me.dropFrom = me.y;
          setState('falling');
        },
      });
      const r = range();
      me.x = r.min - 80;
      walkTo(r.min + (r.max - r.min) * 0.3, 'hurry', () => {
        setState('cheering');
        say(greeting(), 4200);
        scheduleIdle(4600);
      });
    }

    return {
      init, tick, measure, say, pose, sleep, wake,
      cheer: (text) => pose('cheering', 2400, text),
      busy: () => me.moving || me.carried || me.falling,
    };
  })();

  /* ---------- 5. Minerva, the owl ---------- */
  /**
   * Perches on the header's bottom edge in its free gap, and flies down to whatever you open.
   * Hover: happy squint. Rub or long-press: giggly wiggle. Click: a tip.
   * Drag her onto any item to keep watch there; drop her anywhere else and she flies home.
   */
  const Owl = (() => {
    const host = buildCharacter('owl', 'Say hello to Minerva, the owl', OWL_SVG);
    const bubble = host.querySelector('.c-bubble');
    const button = host.querySelector('.c-hit');
    const eyes = { els: [...host.querySelectorAll('.owl-pupil, .owl-glint')], key: '' };
    const me = { x: 0, y: 0, tilt: 0, state: 'perched', flight: null, anchor: null, sleeping: false, carried: false, homeless: false };
    let homeTimer = 0;
    let bubbleTimer = 0;
    let header = null;

    /** The middle of the free gap in the header, on its bottom edge. Null when there is no room. */
    function perchPoint() {
      const p = frame.perch;
      if (!p) return null;
      return { x: p.x, y: p.y };
    }
    function measure() {
      header = header || document.querySelector('[data-companion-perch]');
      if (!header) { frame.perch = null; return; }
      const h = header.getBoundingClientRect();
      const after = header.querySelector('[data-companion-perch-after]');
      const left = after ? after.getBoundingClientRect().right : h.left;
      let right = h.right;
      header.querySelectorAll('[data-companion-perch-before]').forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.width > 0 && r.left > left) right = Math.min(right, r.left);
      });
      frame.header = h;
      // Needs about 64px of free header for her 48px body plus a little air on each side.
      frame.perch = right - left >= 64 ? { x: (left + right) / 2, y: h.bottom - 1 } : null;
    }

    function landingPoint(target) {
      if (!target || !target.isConnected || target.closest('[hidden]')) return null;
      const r = target.getBoundingClientRect();
      const top = (frame.header ? frame.header.bottom : 0) + 56;
      const bottom = window.innerHeight - 70;
      if (r.top + 5 < top || r.top + 5 > bottom || r.width === 0) return null;
      return { x: clamp(r.right - 44, r.left + 24, r.right - 24), y: r.top + 5 };
    }
    function setState(next) {
      me.state = next;
      host.dataset.state = next;
    }
    function flyTo(getPoint, onLand) {
      const target = getPoint();
      if (!target) return false;
      const from = { x: me.x, y: me.y };
      const dist = Math.hypot(target.x - from.x, target.y - from.y);
      me.flight = { from, getPoint, onLand, t0: performance.now(), dur: clamp(dist * 1.4, 450, 1300) };
      setState('flying');
      return true;
    }
    function landOn(target, ms = 10000) {
      if (!target || me.carried) return false;
      if (me.sleeping) wake(true);
      clearTimeout(homeTimer);
      if (me.anchor === target && me.state === 'landed') {
        homeTimer = setTimeout(goHome, ms);
        return true;
      }
      me.anchor = target;
      const ok = flyTo(() => landingPoint(target), () => {
        setState('landed');
        homeTimer = setTimeout(goHome, ms);
      });
      if (!ok) me.anchor = null;
      return ok;
    }
    function goHome() {
      clearTimeout(homeTimer);
      me.anchor = null;
      if (me.state === 'perched' || me.carried) return;
      if (!flyTo(perchPoint, () => setState(me.sleeping ? 'sleeping' : 'perched'))) setState(me.sleeping ? 'sleeping' : 'perched');
    }
    function say(text, ms = 3000) {
      setBubble(bubble, text);
      bubbleShift(bubble, me.x);
      bubble.classList.add('is-visible');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => bubble.classList.remove('is-visible'), ms);
    }
    function sleep() {
      if (me.sleeping || me.carried) return;
      me.sleeping = true;
      clearTimeout(homeTimer);
      bubble.classList.remove('is-visible');
      if (me.state !== 'flying') setState('sleeping');
    }
    function wake(quiet) {
      if (!me.sleeping) return;
      me.sleeping = false;
      if (me.state === 'sleeping') setState(me.anchor ? 'landed' : 'perched');
      if (!quiet) say('Hoo? Oh, you’re back!', 2400);
      if (me.anchor) homeTimer = setTimeout(goHome, 6000);
    }

    function tick(now) {
      const reduced = motionReduced();
      if (me.carried) {
        // position comes from the drag
      } else if (me.flight) {
        const f = me.flight;
        let p = f.getPoint();
        if (!p) { // target scrolled away mid-flight: head home instead
          me.anchor = null;
          f.getPoint = perchPoint;
          f.onLand = () => setState(me.sleeping ? 'sleeping' : 'perched');
          p = perchPoint();
        }
        if (!p) { me.flight = null; } else {
          const raw = reduced ? 1 : clamp((now - f.t0) / f.dur, 0, 1);
          const t = raw < 0.5 ? 2 * raw * raw : 1 - ((-2 * raw + 2) ** 2) / 2; // ease in-out
          const cx = (f.from.x + p.x) / 2;
          const cy = Math.min(f.from.y, p.y) - 70;
          me.x = (1 - t) ** 2 * f.from.x + 2 * (1 - t) * t * cx + t * t * p.x;
          me.y = (1 - t) ** 2 * f.from.y + 2 * (1 - t) * t * cy + t * t * p.y;
          const lean = raw < 0.85 ? clamp((p.x - f.from.x) / 40, -14, 14) : 0; // level out before landing
          me.tilt += (lean - me.tilt) * 0.12;
          if (raw >= 1) {
            me.flight = null;
            f.onLand();
            if (me.sleeping && me.state !== 'sleeping') setState('sleeping');
          }
        }
      } else if (me.anchor) {
        const p = landingPoint(me.anchor);
        if (!p) goHome();
        else { me.x = p.x; me.y = p.y; }
      } else {
        const p = perchPoint();
        if (p) { me.x = p.x; me.y = p.y; }
      }
      // No room in the header (a very narrow screen) and not out on an item: stay out of the way.
      host.hidden = !frame.perch && !me.anchor && !me.flight && !me.carried;
      if (!me.flight && !me.carried) me.tilt *= 0.85;
      host.style.setProperty('--tilt', `${me.tilt.toFixed(2)}deg`);
      host.style.transform = `translate3d(${me.x.toFixed(1)}px, ${me.y.toFixed(1)}px, 0)`;
      if (!me.sleeping) lookAt(eyes, me.x, me.y - 29, 2.2);
      if (bubble.classList.contains('is-visible')) bubbleShift(bubble, me.x);
    }

    function init() {
      measure();
      const p = perchPoint();
      if (p) { me.x = p.x; me.y = p.y; }
      setState('perched');
      button.addEventListener('click', () => {
        if (me.sleeping) { wake(false); return; }
        pulse(host, 'is-hop', 600);
        const tip = pickTip();
        say(`Hoo! ${tip}`, 4400);
        announce(tip);
      });
      watchHover(button, {
        onNotice: () => { if (!me.sleeping) pulse(host, 'is-happy', 1400); },
        onTickle: () => {
          if (me.sleeping) { wake(false); return; }
          pulse(host, 'is-tickled', 1600);
          say(pick(['Hoo-hoo! That tickles!', 'Ruffling my feathers, are we?', 'Hoo! Careful, I just preened.']), 2600);
        },
      });
      makeDraggable(button, {
        onStart: () => {
          me.sleeping = false;
          me.carried = true;
          me.flight = null;
          me.anchor = null;
          clearTimeout(homeTimer);
          setState('carried');
        },
        onMove: (x, y) => {
          me.tilt = clamp((x - me.x) * 1.5, -18, 18);
          me.x = x;
          me.y = y + 30;
        },
        onDrop: (x, y) => {
          me.carried = false;
          const item = itemUnder(x, y, host);
          if (item && landOn(item, 20000)) {
            const title = itemTitle(item);
            say(title ? `Hoo! I’ll keep an eye on “${shorten(title, 40)}”.` : 'Hoo! I’ll keep watch here.', 3200);
          } else {
            setState('flying');
            if (!flyTo(perchPoint, () => setState('perched'))) setState('perched');
            say('Hoo! Back to my perch.', 2200);
          }
        },
      });
      setTimeout(() => say(data.owlGreeting || 'Hoo! Welcome!', 3800), 2600);
    }

    return { init, tick, measure, landOn, goHome, say, sleep, wake, hop: () => pulse(host, 'is-hop', 600), busy: () => Boolean(me.flight || me.anchor || me.carried) };
  })();

  /* ---------- 6. Page events ---------- */
  const reactions = {
    opened: (d) => { if (d.target) Owl.landOn(d.target, 12000); },
    copied: () => Pip.cheer(pick(['Copied! Ready to cite.', 'Nice, that’s in your clipboard.'])),
    'copy-failed': () => Pip.pose('worried', 3200, 'Copying was blocked. The text is selected, so press Ctrl+C.'),
    placeholder: () => Pip.pose('thinking', 3200, 'That link isn’t set up yet.'),
    theme: (d) => Owl.say(d.dark ? 'Hoo! Lights down, much cosier.' : 'Hoo! Bright and early!', 2400),
    paused: (d) => { if (d.target && Owl.landOn(d.target, 9000)) Owl.say('Hoo! Let me take a closer look.', 2600); },
    resumed: () => Owl.goHome(),
    menu: (d) => { if (d.open) Owl.hop(); },
    saved: () => Pip.cheer('Saved!'),
    error: () => Pip.pose('worried', 3200, 'Hmm, something went wrong.'),
  };
  function react(type, detail = {}) {
    if (detail.announce) announce(detail.announce);
    const fn = reactions[type];
    if (fn) fn(detail);
  }
  document.addEventListener('companion', (e) => react(e.detail && e.detail.type, e.detail || {}));

  // Opening an item (clicking it, or tabbing to it with the keyboard) sends Minerva over.
  // Buttons and links inside an item send their own, more specific event (e.g. "resumed"), so skip them.
  document.addEventListener('click', (e) => {
    const item = e.target.closest && e.target.closest('[data-companion-item]');
    if (!item || e.target.closest('.companion')) return;
    const control = e.target.closest(INTERACTIVE);
    if (control && item.contains(control)) return;
    Owl.landOn(item, 10000);
  });
  document.addEventListener('focusin', (e) => {
    const item = e.target.closest && e.target.closest('[data-companion-item]');
    if (item && e.target.matches(':focus-visible')) Owl.landOn(item, 10000);
  });

  /* ---------- 7. Loop & sleep ---------- */
  function start() {
    Pip.init();
    Owl.init();
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // 1) measure: every frame while someone travels, four times a second at rest
      const busy = Pip.busy() || Owl.busy();
      if (busy || now - lastMeasure >= 250) {
        lastMeasure = now;
        Owl.measure();
        Pip.measure();
      }
      // 2) move: Minerva reads her target's position (already laid out), then both write transforms
      Owl.tick(now);
      Pip.tick(dt);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    let lastActivity = Date.now();
    let asleep = false;
    const onActivity = () => {
      lastActivity = Date.now();
      if (asleep) {
        asleep = false;
        Pip.wake(false);
        Owl.wake(true);
      }
    };
    ['pointermove', 'pointerdown', 'keydown', 'wheel', 'scroll', 'touchstart'].forEach((type) => {
      window.addEventListener(type, onActivity, { passive: true });
    });
    setInterval(() => {
      if (!asleep && Date.now() - lastActivity >= SLEEP_AFTER_MS) {
        asleep = true;
        Pip.sleep();
        Owl.sleep();
      }
    }, 1000);
  }

  /* ---------- 8. Boot ---------- */
  window.Companions = { react, announce, motionReduced };
  document.body.classList.add('has-companions');
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
