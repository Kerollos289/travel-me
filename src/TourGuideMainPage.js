//TourGuideMainPage.js
import React from "react";
import { Link } from "react-router-dom";
import "./ButtonStyles.css"; // Optional: for button styles

const TourGuideMainPage = () => {
  return (
    <div className="tour-guide-main">
      <h1>Tour Guide Dashboard</h1>
      <div className="buttons-container">
        <Link to="/tour-guide">
          <button className="role-btn">My Profile</button>
        </Link>
        <Link to="/itinerary">
          <button className="role-btn">Itinerary</button>
        </Link>
        <Link to="/guest">
          <button className="role-btn">My Sales</button>
        </Link>
        <Link to="/">
          <button className="role-btn">Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default TourGuideMainPage;
