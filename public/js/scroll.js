export function initScrollAnimations() {
  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offset = 80; // Adjust for fixed header height
        const topPosition = targetSection.offsetTop - offset;

        window.scrollTo({
          top: topPosition,
          behavior: "smooth", // Smooth scrolling for navigation
        });
      }
    });
  });
}