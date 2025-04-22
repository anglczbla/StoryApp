// scripts/main.js

import { renderHome, renderAddForm } from './view.js';
import { getStories, addStory } from './api.js';
import { router } from './router.js';

window.addEventListener('load', async () => {
  await router();
});

window.addEventListener('hashchange', async () => {
  await router();
});

export async function loadHomePage() {
  try {
    const stories = await getStories();
    renderHome(stories);
  } catch (error) {
    alert('Error fetching stories: ' + error.message);
  }
}

export async function loadAddPage() {
  renderAddForm();
}
