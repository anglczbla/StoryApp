// src/components/MapView.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ stories }) => {
  return (
    <MapContainer center={[-6.2, 106.8]} zoom={5} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {stories.map(story => (
        <Marker
          key={story.id}
          position={[story.lat, story.lon]}
        >
          <Popup>
            {story.name}<br />{story.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
