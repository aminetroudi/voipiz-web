/**
 * FR / EN switch.
 *
 * This is an explicit two-state control rather than a one-word toggle. The
 * toggle showed the *target* language — "EN" while the page was in French —
 * which reads as a label of the current state, not an offer. With the choice
 * persisted in localStorage a returning visitor could land in English with the
 * button reading "FR", i.e. no EN button anywhere and pressing the visible one
 * gave French. Two buttons with a pressed state cannot be misread.
 *
 * Also fixes an earlier first-click dead spot: init used
 * `localStorage.getItem(...) || "fr"` but never wrote the fallback back, so the
 * handler read null, `null === "fr"` was false, and the switch set French again.
 */
const KEY = "saved-language";

let lang = "fr";

export function initLanguageManager() {
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (_) {}
  lang = saved === "en" || saved === "fr" ? saved : "fr";

  // capture the French placeholders before anything overwrites them
  document.querySelectorAll("[data-placeholder-en]").forEach((el) => {
    if (!el.dataset.placeholderFr) el.dataset.placeholderFr = el.getAttribute("placeholder") || "";
  });

  apply(lang);

  document.querySelectorAll(".lang [data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.lang;
      if (next === lang) return;
      lang = next;
      apply(lang);
      try { localStorage.setItem(KEY, lang); } catch (_) {}
    });
  });
}

function apply(next) {
  document.documentElement.setAttribute("lang", next);

  document.querySelectorAll(".lang-fr").forEach((el) =>
    el.classList.toggle("d-none", next !== "fr")
  );
  document.querySelectorAll(".lang-en").forEach((el) =>
    el.classList.toggle("d-none", next !== "en")
  );

  document.querySelectorAll(".lang [data-lang]").forEach((button) =>
    button.setAttribute("aria-pressed", String(button.dataset.lang === next))
  );

  document.querySelectorAll("[data-placeholder-en]").forEach((el) => {
    el.setAttribute(
      "placeholder",
      next === "en" ? el.dataset.placeholderEn : el.dataset.placeholderFr || ""
    );
  });
}
