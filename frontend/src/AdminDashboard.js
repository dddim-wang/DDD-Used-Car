// Lab 2: React Component with Router Links
// Lab 1 (partial): Uses external CSS for styling
// src/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'; // Ensure this is located in src/ and correctly linked

const AdminDashboard = () => {
  return (
    <div className="container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="dashboard-welcome">Welcome, Admin!</p>
      <ul className="dashboard-links">
        <li>
          <Link to="/admin/review" className="dashboard-link">
            Review and approve car submissions
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="dashboard-link">
            Manage users
          </Link>
        </li>
        <li>
          <Link to="/admin/stats" className="dashboard-link">
            View system statistics
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;



