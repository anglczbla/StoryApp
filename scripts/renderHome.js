export function renderHome(stories) {
  const container = document.getElementById('app');
  container.innerHTML = `
    <h2>Daftar Cerita</h2>
    <ul class="story-list" aria-live="polite" aria-label="Daftar cerita">
      ${stories.map(story => `
        <li class="story-item" tabindex="0">
          <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" />
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <p>Latitude: ${story.lat}</p>
          <p>Longitude: ${story.lon}</p>
        </li>
      `).join('')}
    </ul>
    <div id="map" style="height: 400px;"></div>
  `;

  // Initialize map
  const map = L.map('map').setView([-6.2, 106.8], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Add markers
  stories.forEach(story => {
    if (story.lat && story.lon) {
      const marker = L.marker([story.lat, story.lon]).addTo(map);
      marker.bindPopup(\`
        <strong>\${story.name}</strong><br/>
        \${story.description}<br/>
        <img src="\${story.photoUrl}" alt="Foto cerita oleh \${story.name}" style="width: 100px; height: auto;"/>
      \`);
    }
  });
}
