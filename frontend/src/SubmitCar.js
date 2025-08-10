// src/SubmitCar.js
// Programming Lab 2: Submit car listing using backend API instead of localStorage

import React, { useState } from 'react';

const API_BASE = 'http://127.0.0.1:5000';

const SubmitCar = () => {
  // Car submission form state
  const [carData, setCarData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    transmission: '',
    fuelType: '',
    vin: '',
    imageUrl: '',
    location: '',
    description: '',
    contactInfo: '',
  });

  // Handle input change for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      alert('Please log in first.');
      return;
    }

    // Construct submission with user info (match backend expectations)
    const payload = {
      ...carData,
      // ensure numeric fields are numbers
      year: carData.year ? Number(carData.year) : null,
      price: carData.price ? Number(carData.price) : null,
      mileage: carData.mileage ? Number(carData.mileage) : null,

      // ✅ send both userId (preferred) and submittedBy (camelCase)
      userId: currentUser.id,                 // backend will resolve to username
      submittedBy: currentUser.username,      // fallback if you keep the legacy path
      approved: false,
    };

    try {
      const response = await fetch(`${API_BASE}/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Car submitted for review!');
        // Reset form after submission
        setCarData({
          make: '',
          model: '',
          year: '',
          price: '',
          mileage: '',
          transmission: '',
          fuelType: '',
          vin: '',
          imageUrl: '',
          location: '',
          description: '',
          contactInfo: '',
        });
      } else {
        console.error('Submission failed:', result);
        alert(`Submission failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Server connection failed.');
    }
  };

  return (
    <div className="container">
      <h2>Submit a Used Car</h2>
      <form onSubmit={handleSubmit}>
        {/* Car Make */}
        <div className="form-group">
          <label htmlFor="make">Car Make</label>
          <input
            className="form-input"
            type="text"
            id="make"
            name="make"
            value={carData.make}
            onChange={handleChange}
            required
          />
        </div>

        {/* Model */}
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <input
            className="form-input"
            type="text"
            id="model"
            name="model"
            value={carData.model}
            onChange={handleChange}
            required
          />
        </div>

        {/* Year */}
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            className="form-input"
            type="number"
            id="year"
            name="year"
            value={carData.year}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input
            className="form-input"
            type="number"
            id="price"
            name="price"
            value={carData.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mileage */}
        <div className="form-group">
          <label htmlFor="mileage">Mileage (km)</label>
          <input
            className="form-input"
            type="number"
            id="mileage"
            name="mileage"
            value={carData.mileage}
            onChange={handleChange}
            required
          />
        </div>

        {/* Transmission */}
        <div className="form-group">
          <label htmlFor="transmission">Transmission</label>
          <select
            className="form-select"
            id="transmission"
            name="transmission"
            value={carData.transmission}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div className="form-group">
          <label htmlFor="fuelType">Fuel Type</label>
          <select
            className="form-select"
            id="fuelType"
            name="fuelType"
            value={carData.fuelType}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* VIN */}
        <div className="form-group">
          <label htmlFor="vin">VIN Number</label>
          <input
            className="form-input"
            type="text"
            id="vin"
            name="vin"
            value={carData.vin}
            onChange={handleChange}
          />
        </div>

        {/* Image URL */}
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            className="form-input"
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={carData.imageUrl}
            onChange={handleChange}
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            className="form-input"
            type="text"
            id="location"
            name="location"
            value={carData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Contact Info */}
        <div className="form-group">
          <label htmlFor="contactInfo">Seller Contact Info</label>
          <input
            className="form-input"
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={carData.contactInfo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-input"
            id="description"
            name="description"
            rows="4"
            value={carData.description}
            onChange={handleChange}
            placeholder="Describe condition, accidents, features..."
          />
        </div>

        <button className="primary-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitCar;









