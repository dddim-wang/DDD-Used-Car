// src/ManageUsers.js
// ✅ Lab 4 Upgrade: Use backend APIs for user management

import React, { useEffect, useState } from 'react';
import './style.css';

const API_BASE = 'http://127.0.0.1:5000';  // ✅ Use 127.0.0.1 to avoid CORS issues

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  // Load current user from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    setCurrentUser(savedUser);
  }, []);

  // Fetch all users from backend
  const fetchUsers = () => {
    fetch(`${API_BASE}/users`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => setUsers(data.data))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user (except admin)
  const handleDeleteUser = (id) => {
    const userToDelete = users.find((user) => user.id === id);
    if (!userToDelete) return;

    if (userToDelete.username === 'admin') {
      alert('Cannot delete admin user.');
      return;
    }

    fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete user.');
        fetchUsers();
        if (currentUser && currentUser.id === id) {
          localStorage.removeItem('currentUser');
          setCurrentUser(null);
        }
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="container">
      <h1 className="dashboard-title">Manage Users</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p style={{ fontWeight: 'bold', color: '#333' }}>
        Currently logged in as:{' '}
        <span style={{ color: '#007bff' }}>
          {currentUser
            ? `${currentUser.username} (${currentUser.isAdmin ? 'Admin' : 'User'})`
            : 'None'}
        </span>
      </p>

      {/* User List */}
      {users.length === 0 ? (
        <p style={{ color: '#888' }}>No users found.</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className="user-row">
              <span className="user-name">{user.username}</span>
              <span className="user-role-label">
                {user.username === 'admin' ? 'Admin' : 'User'}
              </span>
              {user.username !== 'admin' && (
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageUsers;




















