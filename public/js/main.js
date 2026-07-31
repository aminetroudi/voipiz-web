import { initNavigation } from "./navigation.js";
import { initFormHandler } from "./formHandler.js";
import { initCookieBanner } from "./cookieBanner.js";
import { initLanguageManager } from "./languageManager.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initFormHandler();
  initCookieBanner();
  initLanguageManager();

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});

/* --- Hero video ---
   The poster image is what actually renders first; the video only replaces it
   once it can play through, and never on a metered or 2G connection. */
window.addEventListener("load", () => {
  const video = document.getElementById("bg-video");
  const poster = document.getElementById("fallback-image");
  if (!video) return;

  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const frugal = c && (c.saveData || /^(slow-)?2g$/.test(c.effectiveType || ""));
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (frugal || still) return;   // keep the poster

  video.addEventListener("canplaythrough", () => {
    video.style.display = "block";
    if (poster) poster.style.display = "none";
  }, { once: true });

  video.addEventListener("error", () => {
    // poster stays; nothing to do
  }, { once: true });
});
