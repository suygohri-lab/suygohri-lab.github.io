/**
 * Letter-by-letter code typing animation.
 * The line is split into syntax-highlighted tokens; each character is appended
 * to its token's <span>, so colors appear as the text is typed.
 */
(() => {
  const TOKENS = [
    ["fun", "keyword"], [" ", "punct"],
    ["<", "punct"], ["T", "type-param"], [" : ", "punct"],
    ["Comparable", "type"], ["<", "punct"], ["T", "type-param"], [">>", "punct"], [" ", "punct"],
    ["List", "type"], ["<", "punct"], ["T", "type-param"], [">", "punct"], [".", "punct"],
    ["quickSort", "function"], ["(): ", "punct"],
    ["List", "type"], ["<", "punct"], ["T", "type-param"], [">", "punct"], [" = ", "punct"],
    ["when", "keyword"], [" {", "punct"],
  ];

  // Timing (ms): a steady base speed with small random variation reads as human typing.
  const START_DELAY = 600;
  const BASE_DELAY = 55;
  const JITTER = 35;
  const SPACE_PAUSE = 40; // brief extra hesitation after a space

  const root = document.querySelector("[data-code-typing]");
  if (!root) return;

  const output = root.querySelector("[data-output]");
  const replay = root.querySelector("[data-replay]");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let timer = 0;

  const makeSpan = (kind) => {
    const span = document.createElement("span");
    span.className = `tok-${kind}`;
    output.append(span);
    return span;
  };

  function renderInstantly() {
    output.replaceChildren();
    for (const [text, kind] of TOKENS) makeSpan(kind).textContent = text;
  }

  function type() {
    clearTimeout(timer);
    output.replaceChildren();
    root.classList.add("is-typing");

    let tokenIndex = 0;
    let charIndex = 0;
    let span = null;

    const step = () => {
      if (tokenIndex >= TOKENS.length) {
        root.classList.remove("is-typing"); // caret starts blinking at the end
        return;
      }
      const [text, kind] = TOKENS[tokenIndex];
      if (charIndex === 0) span = makeSpan(kind);

      const char = text[charIndex];
      span.textContent += char;
      charIndex += 1;
      if (charIndex === text.length) {
        tokenIndex += 1;
        charIndex = 0;
      }

      const delay = BASE_DELAY + (Math.random() * 2 - 1) * JITTER + (char === " " ? SPACE_PAUSE : 0);
      timer = setTimeout(step, delay);
    };

    timer = setTimeout(step, START_DELAY);
  }

  if (reduceMotion) {
    renderInstantly();
  } else {
    // Start typing the first time the editor scrolls into view.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      type();
    }, { threshold: 0.4 });
    observer.observe(root);
  }

  replay?.addEventListener("click", () => (reduceMotion ? renderInstantly() : type()));
})();
