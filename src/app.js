import "./utils/router.js";

// View Transition API support
if (document.startViewTransition === undefined) {
  document.startViewTransition = (callback) => {
    callback();
    return { finished: Promise.resolve() };
  };
}