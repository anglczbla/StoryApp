window.addEventListener("hashchange", () => renderPage());
window.addEventListener("load", () => renderPage());

function renderPage() {
  const hash = window.location.hash.substr(1);
  const main = document.querySelector("main");

  switch (hash) {
    case "add":
      import("../view/add-story-view.js").then((module) => module.default.render());
      break;
    default:
      import("../view/story-list-view.js").then((module) => module.default.render());
  }
}