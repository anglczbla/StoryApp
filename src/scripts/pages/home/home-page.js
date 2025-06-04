import {
  generateLoaderAbsoluteTemplate,
  generateReportItemTemplate,
  generateReportsListEmptyTemplate,
  generateReportsListErrorTemplate,
} from "../../templates";
import HomePresenter from "./home-presenter";
import * as CityCareAPI from "../../data/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section>
        <div class="reports-list__map__container">
          <div id="map" class="reports-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Daftar Cerita Pengguna</h1>

        <div class="reports-list__container">
          <div id="reports-list"></div>
          <div id="reports-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: CityCareAPI,
    });

    await this.#presenter.initialGalleryAndMap();
    const stories = this.#presenter.getStories?.() || []; // fallback empty array

    await this.initialMap(stories);
  }

  populateReportsList(message, stories) {
    if (stories.length <= 0) {
      this.populateReportsListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      return accumulator.concat(
        generateReportItemTemplate({
          id: story.id,
          name: story.name,
          description: story.description,
          evidenceImages:
            story.evidenceImages || (story.photoUrl ? [story.photoUrl] : []),
          reporterName: story.name,
          createdAt: story.createdAt,
          location: {
            lat: story.lat,
            lon: story.lon,
          },
        })
      );
    }, "");

    document.getElementById("reports-list").innerHTML = `
      <div class="reports-list">${html}</div>
    `;
  }

  populateReportsListEmpty() {
    document.getElementById("reports-list").innerHTML =
      generateReportsListEmptyTemplate();
  }

  populateReportsListError(message) {
    document.getElementById("reports-list").innerHTML =
      generateReportsListErrorTemplate(message);
  }

  async initialMap() {
    const mapContainer = document.getElementById("map");

    // Cegah error: "Map container is already initialized"
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    const initialLatLng = [-2.972545, 104.774436];

    const map = L.map("map").setView(initialLatLng, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showLoading() {
    document.getElementById("reports-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById("reports-list-loading-container").innerHTML = "";
  }
}
