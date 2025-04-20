// src/utils/router.js
export function initRouter() {
  window.addEventListener("hashchange", renderPage);
  window.addEventListener("load", renderPage);
}

async function renderPage() {
  const hash = window.location.hash.substr(1);
  const main = document.querySelector("main");

  // Smooth page transition using View Transition API
  if (!document.startViewTransition) {
    loadPage(hash, main);
  } else {
    document.startViewTransition(() => loadPage(hash, main));
  }
}

async function loadPage(hash, main) {
  switch (hash) {
    case "add":
      const addModule = await import("../view/add-story-view.js");
      addModule.default.render();
      break;
    default:
      const listModule = await import("../view/story-list-view.js");
      listModule.default.render();
  }
}
