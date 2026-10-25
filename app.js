const modes = new Set(["search", "images", "advanced"]);
const requestedMode = new URLSearchParams(window.location.search).get("mode");
const currentMode = modes.has(requestedMode) ? requestedMode : "search";
const body = document.body;

document.querySelectorAll("[data-view]").forEach((view) => {
  view.hidden = view.dataset.view !== currentMode;
});

body.classList.add(`mode-${currentMode}`);

document.querySelectorAll(".top-nav .tab-link").forEach((link) => {
  const linkMode = new URL(link.href).searchParams.get("mode") || "search";
  const isCurrentMode = linkMode === currentMode;
  link.classList.toggle("is-active", isCurrentMode);
  if (isCurrentMode) {
    link.setAttribute("aria-current", "page");
  } else {
    link.removeAttribute("aria-current");
  }
});

const toast = document.querySelector(".toast");
let toastTimer;

document.querySelectorAll("[data-validator]").forEach((link) => {
  const pageUrl = new URL(window.location.href);
  const isHosted = pageUrl.protocol === "http:" || pageUrl.protocol === "https:";

  if (isHosted) {
    const validatorUrl = link.dataset.validator === "html"
      ? new URL("https://validator.w3.org/nu/")
      : new URL("https://jigsaw.w3.org/css-validator/validator");
    validatorUrl.searchParams.set(link.dataset.validator === "html" ? "doc" : "uri", link.dataset.validator === "html"
      ? pageUrl.href
      : new URL("styles.css", pageUrl).href);
    link.href = validatorUrl.href;
  } else {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Validace vyžaduje, aby byla stránka dostupná přes veřejnou HTTP(S) adresu.");
    });
  }
});

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 3200);
}

document.querySelectorAll(".voice-button").forEach((button) => {
  button.addEventListener("click", () => {
    showToast("Hlasové vyhledávání není v této ukázce dostupné.");
  });
});

document.querySelectorAll(".camera-button").forEach((button) => {
  button.addEventListener("click", () => {
    showToast("Vyhledávání podle obrázku není v této ukázce dostupné.");
  });
});

document.querySelector("[data-lucky]").addEventListener("click", () => {
  const query = document.querySelector("#web-query").value.trim();
  if (!query) {
    document.querySelector("#web-query").focus();
    showToast("Nejprve zadejte, co chcete vyhledat.");
    return;
  }

  const searchUrl = new URL("https://www.google.com/search");
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("btnI", "1");
  window.location.assign(searchUrl);
});

document.querySelector(".advanced-form").addEventListener("submit", (event) => {
  const form = event.currentTarget;
  const hasCriteria = [...form.elements].some((field) => {
    return field.name && field.value.trim() !== "";
  });

  if (!hasCriteria) {
    event.preventDefault();
    showToast("Vyplňte alespoň jedno pole pro vyhledávání.");
  }
});