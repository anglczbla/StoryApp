import { showHomePage, showAddFormPage } from './presenter.js';

async function router() {
  const hash = window.location.hash;

  if (document.startViewTransition) {
    await document.startViewTransition(async () => {
      if (hash === '#/add') {
        await showAddFormPage();
      } else {
        await showHomePage();
      }
    });
  } else {
    if (hash === '#/add') {
      await showAddFormPage();
    } else {
      await showHomePage();
    }
  }
}

export { router };
