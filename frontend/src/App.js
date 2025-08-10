// Lab 2: Set up routing and navigation in a React SPA
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all pages/components
import Navbar from './Navbar';
import Home from './Home';
import Listings from './Listings';
import Login from './Login';
import Register from './Register';
import SubmitCar from './SubmitCar';
import TodoList from './TodoList'; // Lab 3: Todo List feature
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import EditProfile from './EditProfile'; // ✅ NEW: Import Edit Profile page
import CarReview from './CarReview';
import ManageUsers from './ManageUsers';
import SystemStats from './SystemStats';


function App() {
  return (
    <Router>
      {/* Global navigation bar */}
      <Navbar />

      {/* Define all page routes */}
      <Routes>
        <Route path="/" element={<Home />} />                        {/* Home page */}
        <Route path="/listings" element={<Listings />} />           {/* Car listings */}
        <Route path="/login" element={<Login />} />                 {/* Login page */}
        <Route path="/register" element={<Register />} />           {/* Registration page */}
        <Route path="/submit" element={<SubmitCar />} />            {/* Submit new car */}
        <Route path="/todo" element={<TodoList />} />               {/* Todo list */}
        <Route path="/user" element={<UserDashboard />} />          {/* User dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />        {/* Admin dashboard */}
        <Route path="/edit-profile" element={<EditProfile />} />    {/* ✅ NEW: Edit profile */}
        <Route path="/admin/review" element={<CarReview />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/stats" element={<SystemStats />} />


      </Routes>
    </Router>
  );
}

export default App;


