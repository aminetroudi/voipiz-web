/**
 * Scroll reveal.
 *
 * The page used to load GSAP, ScrollTrigger and ScrollToPlugin — ~150KB — and
 * use none of them. This does the job in a few dozen lines.
 *
 * Safety rails, because this module is the only thing between a visitor and
 * invisible body copy:
 *   1. The hidden state lives behind `.js` in the stylesheet, set by an inline
 *      script in <head>. If this module never runs, text is simply visible.
 *   2. showAll() on reduced motion, without IntersectionObserver, or on throw.
 *   3. sweepVisible() on load and once on a timer — it only ever reveals what
 *      is already on screen, so it cannot pre-empt the animation. An earlier
 *      version revealed *everything* if nothing had been revealed yet, which
 *      fires on any page whose reveal targets all start below the fold. That
 *      is every page here, so the animation never ran.
 */
export function initReveal() {
  const items = [...document.querySelectorAll(".reveal")];
  if (!items.length) return;

  const showAll = () => items.forEach((el) => el.classList.add("in"));

  const sweepVisible = () => {
    const vh = window.innerHeight;
    items.forEach((el) => {
      if (el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("in");
    });
  };

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  try {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);   // reveal once, then stop watching
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 }
    );

    items.forEach((el) => io.observe(el));

    // A restored scroll position, or an anchor jump, can land past elements
    // before the observer is watching them.
    window.addEventListener("load", sweepVisible, { once: true });
    window.setTimeout(sweepVisible, 2500);
  } catch (_) {
    showAll();
  }
}
