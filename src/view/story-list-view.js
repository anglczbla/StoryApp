import { fetchStories } from "../models/story-model.js";
import "../components/story-item.js";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const StoryListView = {
  async render() {
    const root = document.querySelector("main");
    root.innerHTML = `
      <h2>Daftar Story</h2>
      <div id="story-list" class="grid"></div>
      <div id="map" style="height: 400px;"></div>
    `;

    const stories = await fetchStories();
    const list = document.getElementById("story-list");
    stories.forEach((story) => {
      const item = document.createElement("story-item");
      item.story = story;
      list.appendChild(item);
    });

    const map = L.map("map").setView([-2.5489, 118.0149], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
  },
};

export default StoryListView;

