// Navbar.js
// Programming Lab 2: Navigation bar component with role-based rendering using React Router and localStorage

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';

const Navbar = () => {
  const navigate = useNavigate();

  // Get login information from localStorage
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  // Logout handler: clear login info and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        {/* Always visible links */}
        <li><Link to="/">Home</Link></li>
        <li><Link to="/listings">Browse Listings</Link></li>
        <li><Link to="/todo">Todo</Link></li>

        {/* Only show "Submit Car" if user is logged in */}
        {username && <li><Link to="/submit">Submit Car</Link></li>}

        {/* Show different dashboards based on role */}
        {role === 'User' && <li><Link to="/user">User Dashboard</Link></li>}
        {role === 'Admin' && <li><Link to="/admin">Admin Dashboard</Link></li>}

        {/* Show Login/Register for guests */}
        {!username && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}

        {/* Show Logout and greeting for logged-in users */}
        {username && (
          <>
            <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
            <li className="nav-username">Hello, {username}</li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
