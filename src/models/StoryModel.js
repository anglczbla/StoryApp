const API_BASE_URL = 'https://story-api.dicoding.dev/v1';

const StoryModel = {
  async getStories() {
    const response = await fetch(`${API_BASE_URL}/stories`);
    const data = await response.json();
    return data.listStory || [];
  },

  async addStory({ photo, description, lat, lon }) {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('description', description);
    formData.append('lat', lat);
    formData.append('lon', lon);

    const response = await fetch(`${API_BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Ganti ini kalau perlu
      },
      body: formData,
    });

    const result = await response.json();
    return result;
  }
};

export default StoryModel;
