// Programming Lab 2 - EditProfile.js
// Connected to backend: updates username in database

import React, { useState, useEffect } from 'react';
import './style.css';

const EditProfile = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null); // Store user ID from localStorage

  // Load user info from localStorage when the component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('user_id');
    if (storedUsername) setUsername(storedUsername);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // Save updated username to backend
  const handleSave = async () => {
    if (!userId) {
      alert('User not logged in.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),  // Only update username
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('username', username); // Update localStorage
        alert('Username updated successfully!');
      } else {
        alert(`Update failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error while updating profile.');
    }
  };

  return (
    <div className="container">
      <h2>Edit Profile</h2>

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <button className="primary-button" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;

