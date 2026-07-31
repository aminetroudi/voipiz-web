/**
 * Scroll reveal.
 *
 * The page used to load GSAP, ScrollTrigger and ScrollToPlugin — ~150KB — and
 * use none of them. This does the job in a dozen lines, and respects
 * prefers-reduced-motion by simply not running.
 */
export function initReveal() {
  const items = [...document.querySelectorAll(".reveal")];
  if (!items.length) return;

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }

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
}
