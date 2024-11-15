import React from "react";
import { Link } from "react-router-dom";
const touristPage = () => {
  return (
    <div className="tour-guide-main">
      <h1>Tourist Dashboard</h1>
      <div className="buttons-container">
        <Link to="/tourist-profile">
          <button className="role-btn">My Profile</button>
        </Link>
        <Link to="/tourist-book-itineraries">
          <button className="role-btn">book itineraries</button>
        </Link>
        <Link to="/tourist-book-activities">
          <button className="role-btn">book activities</button>
        </Link>
      </div>
    </div>
  );
};

export default touristPage;
