import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import IncidentForm from "./IncidentForm";
import { API_BASE_URL } from "../../config/api";

const normalizeIncident = (incident) => ({
  ...incident,
  id: incident.id || incident._id,
  _id: incident._id || incident.id
});

// Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 15); 
  }, [center, map]);
  return null;
}

export default function UserDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [mapCenter, setMapCenter] = useState([30.3862, 76.7894]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetch(`${API_BASE_URL}/api/incidents`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => setIncidents(data.map(normalizeIncident)))
      .catch(err => console.error("Error loading incidents:", err));
  }, []);

  const handleAddIncident = async (newIncident) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/incidents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newIncident), // Sends type, desc, lat, lng, and imageUrl
      });

      if (response.ok) {
        const savedIncident = normalizeIncident(await response.json());
        
        setIncidents((prev) => [savedIncident, ...prev]);
        setMapCenter([savedIncident.latitude, savedIncident.longitude]);
        setIsFormOpen(false);
      } else {
        alert("Failed to save incident to server.");
      }
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const deleteIncident = (id) => {
    setIncidents((prev) => prev.filter(inc => inc.id !== id));
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>⚠️ Live Alerts</h2>
        <div className="feed-container">
          {incidents.length === 0 && <p className="empty-msg">No incidents reported yet.</p>}
          {incidents.map((i) => (
            <div key={i.id} className="incident-card">
              <button className="delete-btn" onClick={() => deleteIncident(i.id)}>×</button>
              <b>{i.type || "General Incident"}</b>
              <p>{i.description}</p>
              {i.imageUrl && <img src={i.imageUrl} alt="incident" className="sidebar-img" />}
              <div className="card-footer">
                <small>📍 {Number(i.latitude).toFixed(4)}, {Number(i.longitude).toFixed(4)}</small>
                <small>{i.timestamp || "Just now"}</small>
              </div>
            </div>
          ))}
        </div>
        <button className="report-btn" onClick={() => setIsFormOpen(true)}>
          ➕ Report Incident at Current Spot
        </button>
      </div>

      <div className="map-container">
        <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
          <ChangeView center={mapCenter} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {incidents.map((i) => (
            <Marker key={i.id} position={[i.latitude, i.longitude]}>
              <Popup>
                <strong>{i.type}</strong><br />
                {i.description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {isFormOpen && (
        <IncidentForm 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={handleAddIncident} 
        />
      )}
    </div>
  );
}