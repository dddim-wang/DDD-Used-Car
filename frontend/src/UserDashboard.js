// Programming Lab 2: User dashboard with navigation and localStorage username
// - Displays a personalized greeting using username from localStorage
// - Provides navigation links to Listings, Submit Car, and Edit Profile pages
// - Demonstrates use of React Router and conditional rendering
// src/pages/UserDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'; // Ensure style.css is inside /src directory

const UserDashboard = () => {
  // Get username from localStorage or default to "User"
  const username = localStorage.getItem('username') || 'User';

  return (
    <div className="container">
      <h2 className="dashboard-title">User Dashboard</h2>
      <p className="dashboard-welcome">Welcome, {username}!</p>
      <ul className="dashboard-links">
        <li>
          <Link to="/listings" className="dashboard-link">View listed cars</Link>
        </li>
        <li>
          <Link to="/submit" className="dashboard-link">Submit a new car</Link>
        </li>
        <li>
          <Link to="/edit-profile" className="dashboard-link">Edit profile</Link>
        </li>
      </ul>
    </div>
  );
};

export default UserDashboard;


