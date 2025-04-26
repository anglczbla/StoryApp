import React, { useRef, useState } from 'react';
import StoryPresenter from '../presenters/StoryPresenter';
import CameraView from '../components/CameraView';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LocationPicker = ({ setLatLon }) => {
  useMapEvents({
    click(e) {
      setLatLon([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const AddStoryPage = () => {
  const [description, setDescription] = useState('');
  const [latLon, setLatLon] = useState([0, 0]);
  const [photoBlob, setPhotoBlob] = useState(null);
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!photoBlob) {
      alert('Please capture a photo first!');
      return;
    }
    const [lat, lon] = latLon;

    const data = {
      photo: photoBlob,
      description,
      lat,
      lon,
    };

    StoryPresenter.createStory(data, (response) => {
      console.log('Story added:', response);
      alert('Story added successfully!');
      window.location.hash = '/'; // Redirect ke HomePage
    });
  };

  return (
    <main id="main-content">
      <h1>Add New Story</h1>
      <form onSubmit={handleSubmit} ref={formRef}>
        <label htmlFor="description">Description:</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Capture Photo:</label>
        <CameraView setPhotoBlob={setPhotoBlob} />

        <label>Pick Location:</label>
        <MapContainer center={[-6.2, 106.8]} zoom={5} style={{ height: "300px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationPicker setLatLon={setLatLon} />
          {latLon[0] !== 0 && (
            <Marker position={latLon} />
          )}
        </MapContainer>

        <button type="submit">Submit Story</button>
      </form>
    </main>
  );
};

export default AddStoryPage;
