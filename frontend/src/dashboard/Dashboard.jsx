import { useState, useEffect } from "react";
import IndiaMap from "./IndiaMap.jsx";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../config/api";

const normalizeIncident = (incident) => {
  if (!incident) {
    return incident;
  }

  return {
    ...incident,
    id: incident.id || incident._id,
    _id: incident._id || incident.id
  };
};

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [view, setView] = useState("active"); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    let socket;
    let isMounted = true;

    const fetchIncidents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/incidents`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const data = await response.json();

        if (!isMounted) {
          return;
        }

        setIncidents(data.map(normalizeIncident));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching incidents:", error);

        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchIncidents();
    if (token) {
      socket = io(API_BASE_URL, {
        auth: { token },
        withCredentials: true,
        transports: ["websocket", "polling"]
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
      });

      socket.on("document-updated", ({ incident }) => {
        if (!incident) {
          return;
        }

        const normalizedIncident = normalizeIncident(incident);

        setIncidents((prev) => {
          const exists = prev.some((item) => item.id === normalizedIncident.id);

          if (exists) {
            return prev.map((item) =>
              item.id === normalizedIncident.id ? { ...item, ...normalizedIncident } : item
            );
          }

          return [normalizedIncident, ...prev];
        });
      });
    }

    return () => {
      isMounted = false;

      if (socket) {
        socket.off("document-updated");
        socket.disconnect();
      }
    };
  }, []);

  const updateIncident = async (id, updates) => {
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      )
    );
  };

  const activeIncidents = incidents.filter((i) => !i.resolved);
  const resolvedIncidents = incidents.filter((i) => i.resolved);

  const incidentsToShow =
    view === "active"
      ? activeIncidents
      : view === "resolved"
      ? resolvedIncidents
      : [];

  if (loading) return <div style={{padding: "20px"}}>Loading Map Data...</div>;

  return (
    <>
      <div className="header">
        SwiftAlert <span>Admin Dashboard</span>
      </div>

      <div className="dashboard">
        <div className="sidebar">
          <h3>Navigation</h3>
          <button onClick={() => setView("active")}>
            View Active Incidents ({activeIncidents.length})
          </button>
          <button onClick={() => setView("resolved")}>
            View Resolved Incidents ({resolvedIncidents.length})
          </button>
          <button onClick={() => setView("stats")}>
            Statistics
          </button>
        </div>

        <div className="map-container">
          {view !== "stats" ? (
            <IndiaMap
              incidents={incidentsToShow}
              allIncidents={incidents}
              updateIncident={updateIncident}
            />
          ) : (
            <div style={{ padding: "40px" }}>
              <h2>📊 Statistics</h2>
              <p>Total Reports: {incidents.length}</p>
              <p>Active: {activeIncidents.length}</p>
              <p>Resolved: {resolvedIncidents.length}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}