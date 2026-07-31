/**
 * Nav: mobile menu, sticky hairline, and active-section tracking.
 *
 * The menu used to be Bootstrap's collapse component. Bootstrap is gone, so
 * the toggle is a dozen lines here instead of 80KB of bundle. Anchor scrolling
 * is now the browser's job — `scroll-behavior` plus `scroll-padding-top` in
 * the stylesheet handle the fixed-header offset that this file used to
 * compute by hand.
 */
export function initNavigation() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  const navLinks = [...document.querySelectorAll(".nav-link")];

  /* --- mobile menu --- */
  const setMenu = (open) => {
    if (!links || !toggle) return;
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  if (toggle && links) {
    toggle.addEventListener("click", () =>
      setMenu(toggle.getAttribute("aria-expanded") !== "true")
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
    document.addEventListener("click", (e) => {
      if (!links.classList.contains("open")) return;
      if (links.contains(e.target) || toggle.contains(e.target)) return;
      setMenu(false);
    });
  }

  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  /* --- a hairline appears under the nav once you leave the hero --- */
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- active section ---
     The old version fired at threshold 0.5 on 100vh sections, which never
     resolved cleanly. Bias the band to the upper third instead, so the
     highlight moves when a section actually takes over the screen. */
  const sections = [...document.querySelectorAll("section[id]")];
  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((l) =>
            l.classList.toggle("active", l.getAttribute("href") === `#${id}`)
          );
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }
}
