//TourismGovernorPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const TourismGovernorPage = () => {
  return (
    <div>
      <h2>Tourism Governor Page</h2>
      <p>This is where tourism governors can manage regional tourism activities.</p>
      <div className="buttons-container"> {/* Optional: Add a container for buttons styling */}
        <Link to="/museum">
          <button className="role-btn">Museums and Historical Places</button> {/* Button to navigate to Museums page */}
        </Link>
        <Link to="/guest">
          <button className="role-btn">My Sales</button> {/* Button to navigate to Guest Sales page */}
        </Link>
        <Link to="/">
          <button className="role-btn">Back to Home</button> {/* Button to navigate back to Home */}
        </Link>
      </div>
    </div>
  );
};

export default TourismGovernorPage;
