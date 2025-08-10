// src/SystemStats.js
// ✅ Lab 4 Upgrade: Fetch system statistics from backend instead of localStorage

import React, { useEffect, useState } from 'react';
import './style.css';

const API_BASE = 'http://127.0.0.1:5000'; // ✅ Use 127.0.0.1 to ensure CORS compatibility

const SystemStats = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    admin_users: 0,
    total_cars: 0,
    approved_cars: 0,
    pending_cars: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics from backend API on component mount
  useEffect(() => {
    fetch(`${API_BASE}/api/stats`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch system stats');
        }
        return res.json();
      })
      .then((data) => {
        setStats(data);        // ✅ Set response data directly
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message); // ✅ Capture and display fetch errors
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="dashboard-title">System Statistics</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul className="dashboard-links">
          <li><strong>Total Users:</strong> {stats.total_users}</li>
          <li><strong>Admins:</strong> {stats.admin_users}</li>
          <li><strong>Total Car Submissions:</strong> {stats.total_cars}</li>
          <li><strong>Approved Listings:</strong> {stats.approved_cars}</li>
          <li><strong>Pending Approvals:</strong> {stats.pending_cars}</li>
        </ul>
      )}
    </div>
  );
};

export default SystemStats;




