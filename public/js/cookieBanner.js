export function initCookieBanner() {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const refuseBtn = document.getElementById("reject-cookies");

  // Show the cookie banner if cookies are not accepted
  if (!localStorage.getItem("cookiesAccepted")) {
    cookieBanner.style.display = "block";
  }

  // Handle "Accept" button click
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "true");
      cookieBanner.style.display = "none";
    });
  }

  // Handle "Refuse" button click
  if (refuseBtn) {
    refuseBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "false");
      cookieBanner.style.display = "none";
    });
  }
}