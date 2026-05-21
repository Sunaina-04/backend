import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const LoginPage = ({ setIsLoggedIn, setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authRole', data.role);
        localStorage.setItem('authUsername', data.username || username);
        setIsLoggedIn(true);
        setRole(data.role);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid Credentials');
      }
    } catch (err) {
      setError('Unable to reach the backend service. Please try again.');
    }
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" style={{display:'block', width:'100%', marginBottom:'10px'}} 
          onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" style={{display:'block', width:'100%', marginBottom:'10px'}} 
          onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={{width:'100%'}}>Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>New here? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default LoginPage;