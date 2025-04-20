class StoryItem extends HTMLElement {
  set story(data) {
    this.innerHTML = `
      <div class="story-card">
        <img src="${data.photoUrl}" alt="Photo by ${data.name}" width="200"/>
        <h3>${data.name}</h3>
        <p>${data.description}</p>
        <small>${new Date(data.createdAt).toLocaleString()}</small>
      </div>
    `;
  }
}

customElements.define("story-item", StoryItem);
