import { getStories, addStory } from './api.js';

async function loadStories() {
  try {
    const stories = await getStories();
    return stories;
  } catch (err) {
    throw new Error('Failed to load stories');
  }
}

async function createStory(formData) {
  try {
    await addStory(formData);
    window.location.hash = '#/';
  } catch (err) {
    throw new Error('Failed to create story');
  }
}

export { loadStories, createStory };
