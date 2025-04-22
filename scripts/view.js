// scripts/view.js

export function renderAddForm() {
    const container = document.getElementById('app');
    container.innerHTML = `
      <h2>Tambah Cerita Baru</h2>
      <form id="storyForm">
        <label for="name">Nama:</label>
        <input type="text" id="name" name="name" required />
  
        <label for="description">Deskripsi:</label>
        <textarea id="description" name="description" required></textarea>
  
        <label for="photo">Foto:</label>
        <input type="file" id="photo" name="photo" accept="image/*" capture="environment" required />
  
        <div id="cameraPreview" style="width: 100%; height: 300px; background-color: #e0e0e0; display: none;">
          <video id="video" width="100%" height="100%" autoplay></video>
          <button id="captureButton">Ambil Foto</button>
          <canvas id="canvas" style="display: none;"></canvas>
        </div>
  
        <input type="hidden" id="lat" name="lat" />
        <input type="hidden" id="lon" name="lon" />
  
        <div id="formMap" style="height: 300px;"></div>
  
        <button type="submit">Kirim</button>
      </form>
    `;
  
    // Inisialisasi peta input lokasi
    const map = L.map('formMap').setView([-6.2, 106.8], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  
    let marker;
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lng;
  
      if (marker) marker.setLatLng([lat, lng]);
      else marker = L.marker([lat, lng]).addTo(map);
    });
  
    // Handle camera input
    document.getElementById('photo').addEventListener('change', startCamera);

    document.getElementById('captureButton').addEventListener('click', capturePhoto);
  
    // Submit form
    document.getElementById('storyForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData();
      formData.append('name', form.name.value);
      formData.append('description', form.description.value);
  
      const photoBlob = await getPhotoBlob();
      formData.append('photo', photoBlob);
      
      formData.append('lat', form.lat.value);
      formData.append('lon', form.lon.value);
  
      try {
        const { addStory } = await import('./model.js');
        await addStory(formData);
        window.location.hash = '#/';
      } catch (err) {
        alert('Gagal menambahkan cerita: ' + err.message);
      }
    });
  
    // Functions for camera interaction
    let videoStream;
    
    function startCamera() {
      const videoElement = document.getElementById('video');
      const cameraPreview = document.getElementById('cameraPreview');
      const captureButton = document.getElementById('captureButton');
  
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            videoElement.srcObject = stream;
            cameraPreview.style.display = 'block';
            videoStream = stream;
          })
          .catch((err) => {
            alert('Tidak dapat mengakses kamera: ' + err.message);
          });
      }
    }
  
    function capturePhoto() {
      const videoElement = document.getElementById('video');
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
  
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      const photoBlob = dataURLtoBlob(dataUrl);
      document.getElementById('photo').files = createFileList(photoBlob);
  
      // Stop the video stream
      videoStream.getTracks().forEach(track => track.stop());
      document.getElementById('cameraPreview').style.display = 'none';
    }
  
    function dataURLtoBlob(dataUrl) {
      const byteString = atob(dataUrl.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);
  
      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }
  
      return new Blob([uintArray], { type: 'image/jpeg' });
    }
  
    function createFileList(blob) {
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      return new DataTransfer().items.add(file).files;
    }
  }
  