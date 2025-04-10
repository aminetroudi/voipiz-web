export function initNavigation() {
  const navLinks = document.getElementById("navLinks");

  // Create overlay for navigation
  const overlay = document.createElement("div");
  overlay.classList.add("nav-overlay");
  document.body.appendChild(overlay);

  // Close navigation menu and overlay on overlay click
  overlay.addEventListener("click", () => {
    navLinks.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Smooth scroll on click
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: targetSection, offsetY: 80 },
          ease: "power2.out",
        });
      }

      // Close the menu after clicking a link (on mobile)
      if (window.innerWidth <= 768) {
        navLinks.classList.remove("active");
        overlay.classList.remove("active");
      }
    });
  });

  // Highlight active section
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => setActiveLink(section.id),
      onEnterBack: () => setActiveLink(section.id),
    });
  });

  function setActiveLink(id) {
    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  }
}