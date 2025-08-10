// src/Listings.js
// ✅ Lab 3 Upgrade: Fetch approved listings from backend instead of localStorage

import React, { useEffect, useState } from 'react';

const Listings = () => {
  const [approvedCars, setApprovedCars] = useState([]);
  const [loading, setLoading] = useState(true); // Optional loading state
  const [error, setError] = useState(null);     // Optional error state

  // Load approved cars from Flask backend on mount
  useEffect(() => {
    fetch('http://127.0.0.1:5000/cars')  // Adjust if your backend URL is different
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch car listings.');
        }
        return res.json();
      })
      .then((data) => {
        // Access the array inside data.data
        const approved = data.data.filter((car) => car.approved === true);
        setApprovedCars(approved);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cars:', err);
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Browse Car Listings</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : approvedCars.length === 0 ? (
        <p className="text-center text-gray-600">No approved listings available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approvedCars.map((car, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-2">
                {car.make} {car.model}
              </h2>

              <p className="text-gray-700 mb-2">
                <strong>Year:</strong> {car.year}<br />
                <strong>Price:</strong> ${car.price}<br />
                <strong>Mileage:</strong> {car.mileage} km<br />
                <strong>Transmission:</strong> {car.transmission}<br />
                <strong>Fuel Type:</strong> {car.fuelType}<br />
                <strong>VIN:</strong> {car.vin || 'Not provided'}<br />
                <strong>Location:</strong> {car.location}<br />
                <strong>Seller Contact:</strong> {car.contactInfo || 'Not provided'}<br />
                <strong>Submitted By:</strong> {car.submittedBy || 'Anonymous'}
              </p>

              {/* Image with label */}
              <div className="mb-2">
                <strong>Image:</strong>{' '}
                {car.imageUrl && /\.(jpeg|jpg|gif|png|webp)$/i.test(car.imageUrl) ? (
                  <img
                    src={car.imageUrl}
                    alt="Car"
                    className="w-full h-48 object-cover rounded mt-1"
                    onError={(e) => {
                      e.target.outerHTML = '<p class="text-gray-500 italic">Not available</p>';
                    }}
                  />
                ) : (
                  <p className="text-gray-500 italic mt-1">Not available</p>
                )}
              </div>

              {/* Optional description */}
              {car.description && (
                <p className="text-gray-700 mt-2">
                  <strong>Description:</strong> {car.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Listings;















