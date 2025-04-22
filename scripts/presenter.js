import { loadStories, createStory } from './model.js';
import { renderHome, renderAddForm } from './view.js';

async function showHomePage() {
  try {
    const stories = await loadStories();
    renderHome(stories);
  } catch (error) {
    alert('Error loading stories');
  }
}

async function showAddFormPage() {
  renderAddForm();
}

async function submitNewStory(formData) {
  await createStory(formData);
  window.location.hash = '#/';
}

export { showHomePage, showAddFormPage, submitNewStory };
