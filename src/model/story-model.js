const API_BASE = "https://story-api.dicoding.dev/v1";
const token = localStorage.getItem("token");

export async function fetchStories() {
  const res = await fetch(`${API_BASE}/stories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.listStory;
}

export async function addStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);
  if (lat && lon) {
    formData.append("lat", lat);
    formData.append("lon", lon);
  }

  const res = await fetch(`${API_BASE}/stories`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return await res.json();
}