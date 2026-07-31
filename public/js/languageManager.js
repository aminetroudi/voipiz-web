/**
 * FR / EN switch.
 *
 * Fixes a first-click dead spot: init used `localStorage.getItem(...) || "fr"`
 * but never wrote the fallback back, so on a fresh browser the click handler
 * read null, `null === "fr"` was false, and the "switch" set French again.
 * State is held in one variable now, and localStorage is only a cache.
 */
const KEY = "saved-language";

let lang = "fr";

export function initLanguageManager() {
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (_) {}
  lang = saved === "en" || saved === "fr" ? saved : "fr";

  // keep the French placeholders before anything overwrites them
  document.querySelectorAll("[data-placeholder-en]").forEach((el) => {
    if (!el.dataset.placeholderFr) el.dataset.placeholderFr = el.getAttribute("placeholder") || "";
  });

  apply(lang);

  const button = document.getElementById("language-switch");
  if (button) {
    button.addEventListener("click", () => {
      lang = lang === "fr" ? "en" : "fr";
      apply(lang);
      try { localStorage.setItem(KEY, lang); } catch (_) {}
    });
  }
}

function apply(next) {
  document.documentElement.setAttribute("lang", next);

  document.querySelectorAll(".lang-fr").forEach((el) =>
    el.classList.toggle("d-none", next !== "fr")
  );
  document.querySelectorAll(".lang-en").forEach((el) =>
    el.classList.toggle("d-none", next !== "en")
  );

  document.querySelectorAll("[data-placeholder-en]").forEach((el) => {
    el.setAttribute(
      "placeholder",
      next === "en" ? el.dataset.placeholderEn : el.dataset.placeholderFr || ""
    );
  });
}
