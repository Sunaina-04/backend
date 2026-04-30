import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// 1. Import local modules
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardSelector from './dashboard/DashboardSelector';

function AppLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(''); 
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const showAuthNavbar = location.pathname === '/login' || location.pathname === '/register';

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      {showAuthNavbar && (
        <nav className="app-navbar">
          <h1 className="app-title">SwiftAlert</h1>
          <button className="theme-toggle" type="button" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>
      )}

      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Dashboard Route */}
       <Route path="/dashboard" element={isLoggedIn ? <DashboardSelector role={role} /> : <Navigate to="/login" />} />

        {/* Default redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;