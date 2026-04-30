import React from "react";
import UserDashboard from "./components/UserDashboard";
import Dashboard from "./Dashboard"; 

export default function DashboardSelector({ role }) {
  
  // 1. If the logged-in user is an Admin, show the Admin view automatically
  if (role === "Admin") {
    return (
      <>
        <div className="dashboard-header">
          <div className="header-content">
            <h1>📊 Admin Dashboard</h1>
          </div>
        </div>
        <Dashboard />
      </>
    );
  }

  // 2. If the logged-in user is a regular User, show the User view automatically
  if (role === "User") {
    return (
      <>
        <div className="dashboard-header">
          <div className="header-content">
            <h1>⚠️ Incident Reporting System</h1>
          </div>
        </div>
        <UserDashboard />
      </>
    );
  }

  // 3. Fallback just in case something goes wrong
  return <div>Loading dashboard...</div>;
}