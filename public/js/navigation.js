export function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.querySelector('header');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offset = header.offsetHeight; // Dynamically calculate header height
        const topPosition = targetSection.offsetTop - offset;

        window.scrollTo({
          top: topPosition,
          behavior: "smooth",
        });
      }

      // Close mobile menu if open
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        bootstrap.Collapse.getInstance(navbarCollapse).hide();
      }
    });
  });

  // Highlight active section
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(section.id);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(section);
  });

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  }
}