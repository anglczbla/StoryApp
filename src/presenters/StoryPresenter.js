import StoryModel from '../models/StoryModel';

const StoryPresenter = {
  async loadStories(callback) {
    try {
      const stories = await StoryModel.getStories();
      callback(stories);
    } catch (error) {
      console.error('Error loading stories:', error);
      callback([]);
    }
  },

  async createStory(data, callback) {
    try {
      const response = await StoryModel.addStory(data);
      callback(response);
    } catch (error) {
      console.error('Error adding story:', error);
    }
  }
};

export default StoryPresenter;
