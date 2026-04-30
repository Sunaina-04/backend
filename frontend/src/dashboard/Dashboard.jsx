import { useState, useEffect } from "react";
import IndiaMap from "./IndiaMap.jsx";

export default function Dashboard() {
  // 1. Initialize with an empty array
  const [incidents, setIncidents] = useState([]);
  const [view, setView] = useState("active"); 
  const [loading, setLoading] = useState(true);

  // 2. Fetch data from the Backend API on load
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/incidents");
        const data = await response.json();
        setIncidents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching incidents:", error);
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  // 3. Updated to handle backend updates (Optional: requires a PUT route on backend)
  const updateIncident = async (id, updates) => {
    // For now, we update the UI state
    // To make this permanent, you'd add a fetch('.../api/incidents/' + id, { method: 'PUT' })
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