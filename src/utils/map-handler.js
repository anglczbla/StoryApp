// src/utils/map-handler.js
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export function initMap(mapId, center = [-2.5489, 118.0149], zoom = 5) {
  const map = L.map(mapId).setView(center, zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  return map;
}

export function addMarker(map, lat, lon, popupText = "") {
  const marker = L.marker([lat, lon]).addTo(map);
  if (popupText) marker.bindPopup(popupText);
}
