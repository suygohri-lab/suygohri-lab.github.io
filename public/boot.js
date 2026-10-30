/*
 * Runs in <head> before the page paints. It's an external file, not inline code, so a strict
 * Content-Security-Policy (script-src 'self') can forbid inline scripts.
 *
 * - Theme: light unless the visitor chose dark.
 * - Motion (the footer's "Animations" setting): "auto" (match device), "full" (always on) or
 *   "reduced". Sets html[data-motion] and, when motion should be reduced, html[data-reduced-motion].
 *   Everything that animates reads data-reduced-motion instead of asking the device directly,
 *   so battery saver doesn't freeze the site when "Always on" is chosen.
 * - Marks that JavaScript runs (html.js) for the scroll-reveal animations.
 */
(() => {
  const html = document.documentElement;
  const read = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };

  html.classList.toggle('dark', read('theme') === 'dark');
  html.classList.add('js');
  // Safety net: if the reveal script never runs (blocked or failed), show the content anyway.
  setTimeout(() => {
    if (!document.querySelector('.revealed')) html.classList.remove('js');
  }, 3000);

  const deviceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const MOTION = ['auto', 'full', 'reduced'];
  const motionPref = () => (MOTION.includes(read('motion')) ? read('motion') : 'auto');

  const apply = () => {
    const pref = motionPref();
    html.dataset.motion = pref;
    html.toggleAttribute('data-reduced-motion', pref === 'reduced' || (pref === 'auto' && deviceQuery.matches));
    window.dispatchEvent(new CustomEvent('motionchange'));
  };
  apply();
  deviceQuery.addEventListener('change', apply);

  window.siteMotion = {
    get: motionPref,
    set(value) {
      if (!MOTION.includes(value)) return;
      try { localStorage.setItem('motion', value); } catch { /* private mode: applies to this visit only */ }
      html.dataset.motion = value;
      html.toggleAttribute('data-reduced-motion', value === 'reduced' || (value === 'auto' && deviceQuery.matches));
      window.dispatchEvent(new CustomEvent('motionchange'));
    },
    deviceAsksForLess: () => deviceQuery.matches,
    reduced: () => html.hasAttribute('data-reduced-motion'),
  };
})();
