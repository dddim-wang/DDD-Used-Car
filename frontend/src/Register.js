// src/Register.js
// Programming Lab 2: User registration form using backend API

import React, { useState } from 'react';

const API_BASE = 'http://127.0.0.1:5000/api'; // Flask backend base URL

const Register = () => {
  // Manage form state for username, email, and password
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Handle input changes and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (submitting) return;

    setSubmitting(true);
    try {
      // Send POST request to backend /api/register
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok && result?.status === 'success' && result?.data) {
        const user = result.data; // { id, username, email }

        // Store current user in localStorage (standardized shape)
        // Note: simple demo — mark admin if username === 'admin'
        localStorage.setItem(
          'currentUser',
          JSON.stringify({
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.username === 'admin',
          })
        );

        alert('Registration successful!');
        // Reset form
        setFormData({ username: '', email: '', password: '' });
      } else {
        const msg =
          result?.message ||
          (res.status === 409
            ? 'Username or email already exists'
            : 'Registration failed');
        alert(msg);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to connect to the server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            className="form-input"
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            className="form-input"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className="form-input"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;








