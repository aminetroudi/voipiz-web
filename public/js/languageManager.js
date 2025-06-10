export function initLanguageManager() {
  const currentLang = localStorage.getItem("saved-language") || "fr";
  setLanguage(currentLang);
  
  const languageSwitch = document.getElementById("language-switch");
  if (languageSwitch) {
    languageSwitch.addEventListener("click", () => {
      const currentLang = localStorage.getItem("saved-language");
      const newLang = currentLang === "fr" ? "en" : "fr";
      setLanguage(newLang);
      localStorage.setItem("saved-language", newLang);
    });
  }
}

function setLanguage(lang) {
  
  document.documentElement.setAttribute("lang", lang);
  
  // Hide all language elements
  document.querySelectorAll('.lang-fr, .lang-en').forEach(el => {
    el.classList.add('d-none');
  });
  
  // Show only elements for current language
  document.querySelectorAll(`.lang-${lang}`).forEach(el => {
    el.classList.remove('d-none');
  });
  
  // Update form placeholders
  document.querySelectorAll('input[data-placeholder-en], textarea[data-placeholder-en]').forEach(el => {
    if (lang === 'en') {
      el.setAttribute('placeholder', el.getAttribute('data-placeholder-en'));
    } else {
      el.setAttribute('placeholder', el.getAttribute('placeholder-original') || el.getAttribute('placeholder'));
    }
  });
  
  // Store original French placeholders (first time only)
  if (lang === 'fr') {
    document.querySelectorAll('input[data-placeholder-en], textarea[data-placeholder-en]').forEach(el => {
      if (!el.getAttribute('placeholder-original')) {
        el.setAttribute('placeholder-original', el.getAttribute('placeholder'));
      }
    });
  }
}