// Programming Lab 2: Admin car submission review interface using backend API
// src/CarReview.js

import React, { useState, useEffect, useCallback } from 'react';
import './style.css';

const API_BASE = 'http://127.0.0.1:5000'; // Flask backend root URL

const CarReview = () => {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLists = useCallback(async () => {
    try {
      setLoading(true);
      const [pRes, aRes] = await Promise.all([
        fetch(`${API_BASE}/cars/pending`),
        fetch(`${API_BASE}/cars/approved`)
      ]);

      const pJson = await pRes.json().catch(() => ({}));
      const aJson = await aRes.json().catch(() => ({}));

      setPending(Array.isArray(pJson?.data) ? pJson.data : []);
      setApproved(Array.isArray(aJson?.data) ? aJson.data : []);
    } catch (err) {
      console.error('Error loading lists:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  // Approve a car via dedicated endpoint
  const handleApprove = async (carId) => {
    try {
      const res = await fetch(`${API_BASE}/cars/${carId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        await fetchLists(); // refresh both lists
      } else {
        const msg = await res.json().catch(() => ({}));
        alert(`Approve failed: ${msg?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error approving car:', error);
    }
  };

  // Reject (delete) a car
  const handleReject = async (carId) => {
    try {
      const res = await fetch(`${API_BASE}/cars/${carId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchLists();
      } else {
        const msg = await res.json().catch(() => ({}));
        alert(`Delete failed: ${msg?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error rejecting car:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="dashboard-title">Admin Panel: Review Car Submissions</h1>

      <h2>🕓 Pending Submissions</h2>
      {loading ? (
        <p>Loading…</p>
      ) : pending.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        <ul className="dashboard-links">
          {pending.map((car) => (
            <li key={car.id}>
              <strong>
                {car.make} {car.model} ({car.year})
              </strong>
              <br />
              Price: ${car.price}
              <br />
              Submitted by: {car.submittedBy || 'Unknown'}
              <div style={{ marginTop: '8px' }}>
                <button
                  className="primary-button"
                  style={{ marginRight: '10px' }}
                  onClick={() => handleApprove(car.id)}
                >
                  Approve
                </button>
                <button
                  className="todo-delete-button"
                  onClick={() => handleReject(car.id)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 style={{ marginTop: '40px' }}>✅ Approved Listings</h2>
      {approved.length === 0 ? (
        <p>No approved listings yet.</p>
      ) : (
        <ul className="dashboard-links">
          {approved.map((car) => (
            <li key={car.id}>
              <strong>
                {car.make} {car.model} ({car.year})
              </strong>
              <br />
              Price: ${car.price}
              <br />
              Submitted by: {car.submittedBy || 'Unknown'}
              <div style={{ marginTop: '8px' }}>
                <button
                  className="todo-delete-button"
                  onClick={() => handleReject(car.id)}
                >
                  Delete Listing
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CarReview;










