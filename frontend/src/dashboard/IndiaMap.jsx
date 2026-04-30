import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { priorityIcons } from "./markerIcon";

const INDIA_BOUNDS = [
  [6.5546, 68.1114],
  [35.6745, 97.3956]
];

export default function IndiaMap({
  incidents,
  allIncidents,
  updateIncident
}) {
  const active = allIncidents.filter((i) => !i.resolved);
  const red = active.filter((i) => i.priority === "high").length;
  const orange = active.filter((i) => i.priority === "medium").length;
  const yellow = active.filter((i) => i.priority === "low").length;
  const resolved = allIncidents.filter((i) => i.resolved).length;

  return (
    <div style={{ height: "100%", position: "relative" }}>
      {/* MAP STATS OVERLAY */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 1000,
          background: "white",
          padding: "12px",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          fontSize: "13px"
        }}
      >
        <b>📍 Incident Summary</b><br />
        Active: {active.length}<br />
        🔴 High: {red}<br />
        🟠 Medium: {orange}<br />
        🟡 Low: {yellow}<br />
        ✅ Resolved: {resolved}
      </div>

      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={5}
        maxBounds={INDIA_BOUNDS}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.latitude, incident.longitude]}
            icon={
              priorityIcons[incident.priority] ||
              priorityIcons.default
            }
          >
            <Popup>
              <div style={{ fontSize: "14px" }}>
                <b>Description</b><br />
                {incident.description}<br /><br />

                <b>Coordinates</b><br />
                Lat: {incident.latitude}<br />
                Lng: {incident.longitude}<br /><br />

                <button
                  style={{
                    marginBottom: "8px",
                    padding: "6px 10px",
                    width: "100%",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                  onClick={() =>
                    alert("View Report (connect to user report form)")
                  }
                >
                  View Report
                </button>

                <b>Priority</b><br />
                <select
                  value={incident.priority}
                  onChange={(e) =>
                    updateIncident(incident.id, {
                      priority: e.target.value
                    })
                  }
                  style={{ width: "100%" }}
                >
                  <option value="low">Low (Yellow)</option>
                  <option value="medium">Medium (Orange)</option>
                  <option value="high">High (Red)</option>
                </select>

                <br /><br />

                <label>
                  <input
                    type="checkbox"
                    onChange={() =>
                      updateIncident(incident.id, {
                        resolved: true
                      })
                    }
                  />{" "}
                  Mark as Resolved / Help Provided
                </label>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
