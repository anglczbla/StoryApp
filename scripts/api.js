// scripts/api.js

const API_BASE_URL = 'https://story-api.dicoding.dev/v1';
const AUTH_TOKEN = 'Bearer <TOKEN_ANDA>'; // Ganti dengan token asli

async function fetchAPI(endpoint, method = 'GET', body = null) {
  const headers = {
    'Authorization': AUTH_TOKEN,
    'Content-Type': 'application/json',
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error('Error fetching data');
  }
  return await response.json();
}

async function getStories() {
  return await fetchAPI('/stories');
}

async function addStory(storyData) {
  const formData = new FormData();
  formData.append('name', storyData.name);
  formData.append('description', storyData.description);
  formData.append('photo', storyData.photo);
  formData.append('lat', storyData.lat);
  formData.append('lon', storyData.lon);

  const response = await fetch(`${API_BASE_URL}/stories`, {
    method: 'POST',
    headers: {
      'Authorization': AUTH_TOKEN,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error adding story');
  }
  return await response.json();
}

export { getStories, addStory };
