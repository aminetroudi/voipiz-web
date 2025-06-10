import { initNavigation } from "./navigation.js";
import { initFormHandler } from "./formHandler.js";
import { initCookieBanner } from "./cookieBanner.js";
import { initLanguageManager } from "./languageManager.js";

document.addEventListener("DOMContentLoaded", function() {
  initNavigation();
  initFormHandler();
  initCookieBanner();
  initLanguageManager();
});

window.addEventListener("load", () => {
  const video = document.getElementById("bg-video");
  const fallbackImage = document.getElementById("fallback-image");
  const fallbackContainer = document.getElementById("fallback-container");

  // Check for slow connections
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isSlowConnection = connection && (connection.effectiveType === "2g" || connection.saveData);

  if (isSlowConnection) {
    console.log("Slow connection detected. Only loading fallback image.");
    return; // Do not load the video
  }

  // Show the video once it's loaded
  video.addEventListener("canplaythrough", () => {
    fallbackContainer.style.display = "none"; // Hide the fallback image
    video.style.display = "block"; // Show the video
  });

  // Handle video loading errors
  video.addEventListener("error", () => {
    console.error("Error loading video. Keeping fallback image.");
  });
});