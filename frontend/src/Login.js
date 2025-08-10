// === Lab 2 & Lab 3 ===
// src/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:5000'; // Backend API base URL

const Login = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('User');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple client-side demo check for admin password
    if (username === 'admin' && password !== 'admin123') {
      alert('Incorrect password for admin!');
      return;
    }

    try {
      // Send login request to backend
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, role, password }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        const currentUser = result.user;

        // Save user info in localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('user_id', currentUser.id);
        localStorage.setItem('username', currentUser.username);

        // Optional: store in localStorage registeredUsers
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const exists = users.some(user => user.name === username);
        if (!exists) {
          const newUser = {
            ...currentUser,
            id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 6),
          };
          users.push(newUser);
          localStorage.setItem('registeredUsers', JSON.stringify(users));
        }

        // Redirect based on role
        if (role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/submit');
        }

      } else {
        alert('Login failed: ' + result.message);
      }

    } catch (error) {
      console.error('Login error:', error);
      alert('Unable to connect to server.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>

        {/* Username input */}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            className="form-input"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password input - now visible for all users */}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            className="form-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Role selection */}
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            className="form-input"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button className="primary-button" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
















