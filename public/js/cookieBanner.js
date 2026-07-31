/**
 * Cookie banner.
 *
 * Uses a class rather than inline display, because the banner is a flex
 * container in the stylesheet and `style.display = "block"` would have
 * flattened its layout.
 */
export function initCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  const accept = document.getElementById("accept-cookies");
  const reject = document.getElementById("reject-cookies");
  if (!banner) return;

  const choice = localStorage.getItem("cookiesAccepted");
  if (choice === null) banner.classList.add("show");

  const decide = (value) => {
    try { localStorage.setItem("cookiesAccepted", value); } catch (_) {}
    banner.classList.remove("show");
  };

  if (accept) accept.addEventListener("click", () => decide("true"));
  if (reject) reject.addEventListener("click", () => decide("false"));
}
