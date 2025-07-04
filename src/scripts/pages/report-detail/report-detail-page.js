import {
  generateCommentsListEmptyTemplate,
  generateCommentsListErrorTemplate,
  generateLoaderAbsoluteTemplate,
  generateRemoveReportButtonTemplate,
  generateReportCommentItemTemplate,
  generateReportDetailErrorTemplate,
  generateReportDetailTemplate,
  generateSaveReportButtonTemplate,
} from "../../templates";
import { createCarousel } from "../../utils";
import ReportDetailPresenter from "./report-detail-presenter";
import { parseActivePathname } from "../../routes/url-parser";
import * as CityCareAPI from "../../data/api";

export default class ReportDetailPage {
  #presenter = null;
  #form = null;

  async render() {
    return `
      <section>
        <div class="report-detail__container">
          <div id="report-detail" class="report-detail"></div>
          <div id="report-detail-loading-container"></div>
           <div id="map" style="height: 400px;"></div>
        </div>
      </section>

      <section class="container">
        <hr>
        <div class="report-detail__comments__container">
          <div class="report-detail__comments-form__container">
            <h2 class="report-detail__comments-form__title">Beri Tanggapan</h2>
            <form id="comments-list-form" class="report-detail__comments-form__form">
              <textarea name="body" placeholder="Beri tanggapan terkait laporan."></textarea>
              <div id="submit-button-container">
                <button class="btn" type="submit">Tanggapi</button>
              </div>
            </form>
          </div>
          <hr>
          <div class="report-detail__comments-list__container">
            <div id="report-detail-comments-list"></div>
            <div id="comments-list-loading-container"></div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new ReportDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: CityCareAPI,
    });

    this.#setupForm();

    this.#presenter.showReportDetail();
    this.#presenter.getCommentsList();
  }

  async populateReportDetailAndInitialMap(message, report) {
    document.getElementById("report-detail").innerHTML =
      generateReportDetailTemplate({
        name: report.name,
        description: report.description,
        photoUrl: report.photoUrl,
        createdAt: report.createdAt,
        lat: report.lat,
        lon: report.lon,
      });

    // Inisialisasi map
    await this.initialMap(report.lat, report.lon, report.name, report.description);

    // Tampilkan tombol aksi
    this.#presenter.showSaveButton();
    this.addNotifyMeEventListener();
  }

  async initialMap(lat, lon, name, description) {
    const map = L.map("map").setView([lat, lon], 18);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    var myIcon = L.icon({
      iconUrl:
        "https://toppng.com/uploads/preview/map-marker-icon-600x-map-marker-11562939743ayfahlvygl.png",
      iconSize: [38, 95],
      iconAnchor: [22, 94],
    });

    const marker = L.marker([lat, lon], { icon: myIcon }).addTo(map);
    
    // Add popup with report details
    marker.bindPopup(`
      <div style="max-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px;">${name}</h3>
        <p style="margin: 0; font-size: 14px;">${description}</p>
      </div>
    `).openPopup();
  }

  populateReportDetailError(message) {
    document.getElementById("report-detail").innerHTML =
      generateReportDetailErrorTemplate(message);
  }

  populateReportDetailComments(message, comments) {
    if (!Array.isArray(comments) || comments.length <= 0) {
      return;
    }

    const html = comments.reduce(
      (accumulator, comment) =>
        accumulator.concat(
          generateReportCommentItemTemplate({
            photoUrlCommenter: comment.commenter.photoUrl,
            nameCommenter: comment.commenter.name,
            body: comment.body,
          })
        ),
      ""
    );

    document.getElementById("report-detail-comments-list").innerHTML = `
      <div class="report-detail__comments-list">${html}</div>
    `;
  }

  populateCommentsListEmpty() {
    document.getElementById("report-detail-comments-list").innerHTML =
      generateCommentsListEmptyTemplate();
  }

  populateCommentsListError(message) {
    document.getElementById("report-detail-comments-list").innerHTML =
      generateCommentsListErrorTemplate(message);
  }

  #setupForm() {
    this.#form = document.getElementById("comments-list-form");
    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        body: this.#form.elements.namedItem("body").value,
      };
      await this.#presenter.postNewComment(data);
    });
  }

  postNewCommentSuccessfully(message) {
    console.log(message);
    this.#presenter.getCommentsList();
    this.clearForm();
  }

  postNewCommentFailed(message) {
    alert(message);
  }

  clearForm() {
    this.#form.reset();
  }

  renderSaveButton() {
    document.getElementById("save-actions-container").innerHTML =
      generateSaveReportButtonTemplate();

    document
      .getElementById("report-detail-save")
      .addEventListener("click", async () => {
        alert("Fitur simpan laporan akan segera hadir!");
      });
  }

  renderRemoveButton() {
    document.getElementById("save-actions-container").innerHTML =
      generateRemoveReportButtonTemplate();

    document
      .getElementById("report-detail-remove")
      .addEventListener("click", async () => {
        alert("Fitur hapus laporan akan segera hadir!");
      });
  }

  addNotifyMeEventListener() {
    const notifyBtn = document.getElementById("report-detail-notify-me");
    if (notifyBtn) {
      notifyBtn.addEventListener("click", () => {
        alert("Fitur notifikasi laporan akan segera hadir!");
      });
    }
  }

  showReportDetailLoading() {
    document.getElementById("report-detail-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideReportDetailLoading() {
    document.getElementById("report-detail-loading-container").innerHTML = "";
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showCommentsLoading() {
    document.getElementById("comments-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideCommentsLoading() {
    document.getElementById("comments-list-loading-container").innerHTML = "";
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Tanggapi
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit">Tanggapi</button>
    `;
  }
}