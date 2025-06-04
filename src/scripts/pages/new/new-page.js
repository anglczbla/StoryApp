import NewPresenter from "./new-presenter";
import { convertBase64ToBlob } from "../../utils";
import * as CityCareAPI from "../../data/api";
import { generateLoaderAbsoluteTemplate } from "../../templates";
import Camera from "../../utils/camera";

export default class NewPage {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenDocumentations = [];

  async render() {
    return `
    <section>
      <div class="new-report__header">
        <div class="container">
          <h1 class="new-report__header__title">Buat Laporan Baru</h1>
          <p class="new-report__header__description">
            Silakan lengkapi formulir di bawah untuk membuat laporan baru.<br>
            Pastikan laporan yang dibuat adalah valid.
          </p>
        </div>
      </div>

      <div class="form-control">
    <label for="name-input">Nama Pelapor</label>
  <input
    type="text"
    id="name-input"
    name="name"
    placeholder="Masukkan nama Anda"
    required
  />
</div>


      <div class="container">
        <form id="new-form" class="new-form">
          <div class="form-control">
            <label for="description-input" class="new-form__description__title">Keterangan</label>
            <div class="new-form__description__container">
              <textarea
                id="description-input"
                name="description"
                placeholder="Masukkan keterangan lengkap laporan. Anda dapat menjelaskan apa kejadiannya, dimana, kapan, dll."
              ></textarea>
            </div>
          </div>

          <div class="form-control">
            <label for="documentations-input" class="new-form__documentations__title">Dokumentasi</label>
            <div id="documentations-more-info">Anda dapat menyertakan foto sebagai dokumentasi.</div>
            <div class="new-form__documentations__container">
              <div class="new-form__documentations__buttons">
                <button id="documentations-input-button" class="btn btn-outline" type="button">
                  Ambil Gambar
                </button>
                <input
                  id="documentations-input"
                  name="documentations"
                  type="file"
                  accept="image/*"
                  multiple
                  hidden="hidden"
                  aria-multiline="true"
                  aria-describedby="documentations-more-info"
                >
                <button id="open-documentations-camera-button" class="btn btn-outline" type="button">
                  Buka Kamera
                </button>
              </div>
              <div id="camera-container" class="new-form__camera__container">
                <video id="camera-video" class="new-form__camera__video">
                  Video stream not available.
                </video>
                <canvas id="camera-canvas" class="new-form__camera__canvas"></canvas>
                <div class="new-form__camera__tools">
                  <select id="camera-select"></select>
                  <div class="new-form__camera__tools_buttons">
                    <button id="camera-take-button" class="btn" type="button">
                      Ambil Gambar
                    </button>
                  </div>
                </div>
              </div>
              <ul id="documentations-taken-list" class="new-form__documentations__outputs"></ul>
            </div>
          </div>

          <div class="form-control">
            <div class="new-form__location__title">Lokasi</div>
            <div class="new-form__location__container">
              <div class="new-form__location__map__container">
                <div id="map" class="new-form__location__map"></div>
                <div id="map-loading-container"></div>
              </div>
              <div class="new-form__location__lat-lng">
                <input type="number" name="lat" step="any" placeholder="Latitude" required />
                <input type="number" name="lon" step="any" placeholder="Longitude" required />
              </div>
            </div>
          </div>

          <div class="form-buttons">
            <span id="submit-button-container">
              <button class="btn" type="submit">Buat Laporan</button>
            </span>
            <a class="btn btn-outline" href="#/">Batal</a>
          </div>
        </form>
      </div>
    </section>
  `;
  }

  async afterRender() {
    this.#presenter = new NewPresenter({
      view: this,
      model: CityCareAPI,
    });
    this.#takenDocumentations = [];

    this.#presenter.showNewFormMap();
    this.#setupForm();

    const initialLatLng = [-2.972545, 104.774436];
    const map = L.map("map").setView(initialLatLng, 20);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const marker = L.marker(initialLatLng).addTo(map);

    // Saat marker digeser, update input latitude & longitude
    marker.on("dragend", function (event) {
      const position = event.target.getLatLng();
      document.querySelector('input[name="lat"]').value = position.lat;
      document.querySelector('input[name="lon"]').value = position.lng;
    });

    // Saat peta diklik, pindahkan marker ke lokasi klik dan update input
    map.on("click", function (e) {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      document.querySelector('input[name="lat"]').value = lat;
      document.querySelector('input[name="lon"]').value = lng;
    });
  }

  async #setupForm() {
    this.#form = document.getElementById("new-form");
    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      console.log(this.#form.elements.namedItem("description").value)
      console.log(this.#takenDocumentations);
      console.log(this.#form.elements.namedItem("lat").value);
      console.log(this.#form.elements.namedItem("lon").value);
      

      const data = {
        description: this.#form.elements.namedItem("description").value,
        evidenceImages: this.#takenDocumentations.map(
          (picture) => picture.blob
        ),
        lat: this.#form.elements.namedItem("lat").value,
        lon: this.#form.elements.namedItem("lon").value,
      };

      console.log(data)

      await this.#presenter.postNewReport(data);
    });

    document
      .getElementById("documentations-input")
      .addEventListener("change", async (event) => {
        const insertingPicturesPromises = Object.values(event.target.files).map(
          async (file) => {
            return await this.#addTakenPicture(file);
          }
        );
        await Promise.all(insertingPicturesPromises);

        await this.#populateTakenPictures();
      });

    document
      .getElementById("documentations-input-button")
      .addEventListener("click", () => {
        this.#form.elements.namedItem("documentations-input").click();
      });

    const cameraContainer = document.getElementById("camera-container");
    document
      .getElementById("open-documentations-camera-button")
      .addEventListener("click", async (event) => {
        cameraContainer.classList.toggle("open");
        this.#isCameraOpen = cameraContainer.classList.contains("open");

        if (this.#isCameraOpen) {
          event.currentTarget.textContent = "Tutup Kamera";
          this.#setupCamera();
          await this.#camera.launch();

          return;
        }

        event.currentTarget.textContent = "Buka Kamera";
        this.#camera.stop();
      });
  }

  async initialMap() {
    // TODO: map initialization
  }

  #setupCamera() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById("camera-video"),
        cameraSelect: document.getElementById("camera-select"),
        canvas: document.getElementById("camera-canvas"),
      });
    }

    this.#camera.addCheeseButtonListener("#camera-take-button", async () => {
      const image = await this.#camera.takePicture();
      await this.#addTakenPicture(image);
      await this.#populateTakenPictures();
    });
  }

  async #addTakenPicture(image) {
    let blob = image;

    if (image instanceof String) {
      blob = await convertBase64ToBlob(image, "image/png");
    }

    const newDocumentation = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };
    this.#takenDocumentations = [
      ...this.#takenDocumentations,
      newDocumentation,
    ];
  }

  async #populateTakenPictures() {
    const html = this.#takenDocumentations.reduce(
      (accumulator, picture, currentIndex) => {
        const imageUrl = URL.createObjectURL(picture.blob);
        return accumulator.concat(`
        <li class="new-form__documentations__outputs-item">
          <button type="button" data-deletepictureid="${
            picture.id
          }" class="new-form__documentations__outputs-item__delete-btn">
            <img src="${imageUrl}" alt="Dokumentasi ke-${currentIndex + 1}">
          </button>
        </li>
      `);
      },
      ""
    );

    document.getElementById("documentations-taken-list").innerHTML = html;

    document
      .querySelectorAll("button[data-deletepictureid]")
      .forEach((button) =>
        button.addEventListener("click", (event) => {
          const pictureId = event.currentTarget.dataset.deletepictureid;

          const deleted = this.#removePicture(pictureId);
          if (!deleted) {
            console.log(`Picture with id ${pictureId} was not found`);
          }

          // Updating taken pictures
          this.#populateTakenPictures();
        })
      );
  }

  #removePicture(id) {
    const selectedPicture = this.#takenDocumentations.find((picture) => {
      return picture.id == id;
    });

    // Check if founded selectedPicture is available
    if (!selectedPicture) {
      return null;
    }

    // Deleting selected selectedPicture from takenPictures
    this.#takenDocumentations = this.#takenDocumentations.filter((picture) => {
      return picture.id != selectedPicture.id;
    });

    return selectedPicture;
  }

  storeSuccessfully(message) {
    console.log(message);
    this.clearForm();

    // Redirect page
    location.hash = "/";
  }

  storeFailed(message) {
    alert(message);
  }

  clearForm() {
    this.#form.reset();
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Buat Laporan
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit">Buat Laporan</button>
    `;
  }
}
