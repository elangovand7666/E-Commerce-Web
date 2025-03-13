import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import axios from "axios";
import L from "leaflet";

// Import marker icons manually
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet marker icons
const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to focus the map on the searched location
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13, { animate: true }); // Adjust zoom level and enable animation
    }
  }, [position, map]);
  return null;
}

function OpenStreetMapComponent({ searchLocation }) {
  const [position, setPosition] = useState([12.9716, 77.5946]); // Default to Bangalore
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    if (!searchLocation) return;

    const fetchClinics = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=clinic+near+${encodeURIComponent(searchLocation)}`
        );
        if (response.data.length > 0) {
          const firstResult = response.data[0];
          setPosition([parseFloat(firstResult.lat), parseFloat(firstResult.lon)]);
          setClinics(response.data);
        }
      } catch (error) {
        console.error("Error fetching clinic data:", error);
      }
    };

    fetchClinics();
  }, [searchLocation]);

  return (
    <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
      <MapUpdater position={position} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {clinics.map((clinic, index) => (
        <Marker key={index} position={[parseFloat(clinic.lat), parseFloat(clinic.lon)]} icon={defaultIcon}>
          <Popup>{clinic.display_name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default OpenStreetMapComponent;
