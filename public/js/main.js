import { initCookieBanner } from "./cookieBanner.js";
import { initScrollAnimations } from "./scroll.js";
import { initNavigation } from "./navigation.js";
import { initFormHandler } from "./formHandler.js";

window.addEventListener("load", () => {
  initCookieBanner();
  initScrollAnimations();
  initNavigation();
  initFormHandler();
});