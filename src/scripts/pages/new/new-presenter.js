export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showNewFormMap: error:", error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewReport({ description, evidenceImages, lat, lon }) {
    this.#view.showSubmitLoadingButton();

    console.log(description, evidenceImages, lat, lon)

    try {
      const formData = new FormData();
      formData.append("description", description);
      if (evidenceImages.length) formData.append("photo", evidenceImages[0]);
      if (lat) formData.append("lat", lat);
      if (lon) formData.append("lon", lon);

     formData.forEach(value =>
     {
      console.log(value)
     }
     )

      const response = await this.#model.storeNewReport({description, evidenceImages, lat, lon});

      if (!response.ok) {
        this.#view.storeFailed(response.message || "Gagal menyimpan laporan");
        return;
      }
      this.#view.storeSuccessfully(
        response.message || "Laporan berhasil disimpan",
        response.data
      );
    } catch (error) {
      this.#view.storeFailed(
        error.message || "Terjadi kesalahan saat menyimpan laporan"
      );
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
