// Programming Lab 2 – Home Page Component (With Image & Improved Layout)
import React from 'react';
import { Link } from 'react-router-dom'; // For internal navigation

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">

        {/* Welcome Title */}
        <h1 className="text-3xl font-bold mb-4">
          Welcome to the Used Car Marketplace!
        </h1>

        {/* Featured car image */}
        <img
          src="/Image/ferrari-812-competizione.jpg"
          alt="Featured used car"
          className="mx-auto mb-6 rounded-xl shadow-md"
          style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
        />

        {/* Short description */}
        <p className="text-gray-700 mb-4">
          Browse and list used cars with ease.
        </p>

        {/* Navigation Links */}
        <ul className="text-left text-gray-700 list-disc list-inside mb-4">
          <li>
            ✔ <Link to="/listings" className="text-blue-500 hover:underline">
              Browse approved listings
            </Link>
          </li>
          <li>
            ✔ <Link to="/login" className="text-blue-500 hover:underline">
              Admin login for car review
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;














