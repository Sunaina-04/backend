import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('password does not match');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('Registration successful! Please login.');
      navigate('/login');
    } else {
      alert('Registration failed.');
    }
  };

  return (
    <div className="auth-box">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" style={{display:'block', width:'100%', marginBottom:'10px'}} 
          onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" style={{display:'block', width:'100%', marginBottom:'10px'}} 
          onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" style={{display:'block', width:'100%', marginBottom:'10px'}} 
          onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button type="submit" style={{width:'100%'}}>Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default RegisterPage;