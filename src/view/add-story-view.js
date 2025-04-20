import { addStory } from "../model/story-model.js";

const AddStoryView = {
  async render() {
    document.querySelector("main").innerHTML = `
      <h2>Tambah Story Baru</h2>
      <form id="add-story-form">
        <label for="description">Deskripsi:</label>
        <textarea id="description" required></textarea><br>

        <label for="photo">Foto (kamera):</label>
        <input type="file" id="photo" accept="image/*" capture="environment" required><br>

        <label for="lat">Latitude:</label>
        <input type="text" id="lat" readonly><br>
        <label for="lon">Longitude:</label>
        <input type="text" id="lon" readonly><br>

        <div id="map" style="height:300px;"></div>
        <button type="submit">Tambah</button>
      </form>
    `;

    const map = L.map("map").setView([-2.5489, 118.0149], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    map.on("click", (e) => {
      document.getElementById("lat").value = e.latlng.lat;
      document.getElementById("lon").value = e.latlng.lng;
    });

    document.getElementById("add-story-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const description = document.getElementById("description").value;
      const photo = document.getElementById("photo").files[0];
      const lat = document.getElementById("lat").value;
      const lon = document.getElementById("lon").value;

      const result = await addStory({ description, photo, lat, lon });
      alert("Story ditambahkan! Redirect ke home...");
      window.location.hash = "";
    });
  },
};

export default AddStoryView;