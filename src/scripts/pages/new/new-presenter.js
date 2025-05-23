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
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewReport({ title, damageLevel, description, evidenceImages, latitude, longitude }) {
    this.#view.showSubmitLoadingButton();

    try {
      // Data yang dikirim ke model harus sesuai API
      const data = {
        title,
        damageLevel,
        description,
        evidenceImages, // ini array Blob/File
        latitude: parseFloat(latitude),  // pastikan tipe data benar
        longitude: parseFloat(longitude),
      };

      const response = await this.#model.storeNewReport(data);

      if (!response.ok) {
        console.error('postNewReport: response error:', response);
        this.#view.storeFailed(response.message || 'Gagal menyimpan laporan');
        return;
      }

      this.#view.storeSuccessfully(response.message || 'Laporan berhasil disimpan', response.data);
    } catch (error) {
      console.error('postNewReport: error:', error);
      this.#view.storeFailed(error.message || 'Terjadi kesalahan saat menyimpan laporan');
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
