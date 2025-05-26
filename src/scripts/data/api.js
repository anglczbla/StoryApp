import { getAccessToken } from '../utils/auth';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  MY_USER_INFO: `${BASE_URL}/users/me`,
  ALL_STORIES: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  ADD_NEW_STORY: `${BASE_URL}/stories`,
 
  // Report
  REPORT_LIST: `${BASE_URL}/reports`,
  REPORT_DETAIL: (id) => `${BASE_URL}/reports/${id}`,
  STORE_NEW_REPORT: `${BASE_URL}/reports`,

  // Report Comment
  REPORT_COMMENTS_LIST: (reportId) => `${BASE_URL}/reports/${reportId}/comments`,
  STORE_NEW_REPORT_COMMENT: (reportId) => `${BASE_URL}/reports/${reportId}/comments`,

  // Report Comment
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  SEND_REPORT_TO_ME: (reportId) => `${BASE_URL}/reports/${reportId}/notify-me`,
  SEND_REPORT_TO_USER: (reportId) => `${BASE_URL}/reports/${reportId}/notify`,
  SEND_REPORT_TO_ALL_USER: (reportId) => `${BASE_URL}/reports/${reportId}/notify-all`,
  SEND_COMMENT_TO_REPORT_OWNER: (reportId, commentId) =>
    `${BASE_URL}/reports/${reportId}/comments/${commentId}/notify`,
};


export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function storeNewReport({
  title,
  damageLevel,
  description,
  evidenceImages,
  latitude,
  longitude,
}) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("damageLevel", damageLevel);
  formData.append("description", description);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);

  evidenceImages.forEach((image, index) => {
    formData.append("evidenceImages", image, `image${index}.png`); // sesuaikan nama field di backend
  });

  try {
    const response = await fetch(`${BASE_URL}/stories`, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: responseData.message || "Gagal mengirim data",
      };
    }

    return {
      ok: true,
      mesage: responseData.message || "Sukses",
      data: responseData.data || null,
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Kesalahan jaringan",
    };
  }
}

export async function registerUser({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const json = await response.json();
  return { ...json, ok: response.ok };
}

export async function loginUser({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await response.json();
  return { ...json, ok: response.ok };
}

export async function getMyUserInfo() {
  const accessToken = getAccessToken();
  const response = await fetch(ENDPOINTS.MY_USER_INFO, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await response.json();
  return { ...json, ok: response.ok };
}

export async function getAllStories({
  page = 1,
  size = 10,
  location = 0,
} = {}) {
  const accessToken = getAccessToken();
  const url = `${ENDPOINTS.ALL_STORIES}?page=${page}&size=${size}&location=${location}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await response.json();
  return { ...json, ok: response.ok };
}

export async function getStoryDetail(id) {
  const accessToken = getAccessToken();
  const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await response.json();
  return { ...json, ok: response.ok };
}

export async function storeNewStory({ description, photo, lat, lon }) {
  const accessToken = getAccessToken();
  const formData = new FormData();
  formData.set("description", description);
  formData.append("photo", photo);
  if (lat) formData.set("lat", lat);
  if (lon) formData.set("lon", lon);

  const response = await fetch(ENDPOINTS.ADD_NEW_STORY, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });
  const json = await response.json();
  return { ...json, ok: response.ok };
}
// Ambil detail laporan
export async function getReportById(reportId) {
  const accessToken = getAccessToken();
  const response = await fetch(`${BASE_URL}/stories/${reportId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await response.json();
  return { data: json.story, ok: response.ok };
}

export const getAllCommentsByReportId = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/reports/${id}/comments`);
    if (!response.ok) {
      throw new Error("Gagal mengambil komentar");
    }

    const result = await response.json();
    return result.data; // Pastikan backend mengembalikan `data`
  } catch (error) {
    console.error("getAllCommentsByReportId error:", error);
    throw error;
  }
};


// Kirim komentar baru
export async function storeNewCommentByReportId(reportId, comment) {
  const token = localStorage.getItem('token'); // atau cara lain kamu menyimpan token

  try {
    const response = await fetch(`https://story-api.dicoding.dev/v1/reports/${reportId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Wajib ditambahkan
      },
      body: JSON.stringify({ comment }), // Komentar harus dalam bentuk objek { comment: "isi" }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error:', error.message);
    }

    return { ok: response.ok };
  } catch (error) {
    console.error('storeNewCommentByReportId error:', error);
    return { ok: false, error: error.message };
  }
}
