export function initCookieBanner() {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const refuseBtn = document.getElementById("reject-cookies");

  // Show the cookie banner if cookies are not accepted or refused
  if (!localStorage.getItem("cookiesAccepted")) {
    cookieBanner.style.display = "block";
  }

  // Handle "Accept" button click
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "true");
      cookieBanner.style.display = "none";
      console.log("Cookies accepted.");
    });
  }

  // Handle "Refuse" button click
  if (refuseBtn) {
    refuseBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "false");
      cookieBanner.style.display = "none";
      console.log("Cookies refused.");
    });
  }

  // Optional: Check the user's choice and act accordingly
  const cookiesAccepted = localStorage.getItem("cookiesAccepted");
  if (cookiesAccepted === "true") {
    console.log("Cookies are enabled.");
    // Initialize analytics or other cookie-dependent features here
  } else if (cookiesAccepted === "false") {
    console.log("Cookies are disabled.");
    // Disable analytics or other cookie-dependent features here
  }
}