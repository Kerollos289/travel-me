// touristPage.js
import React from "react";
import { Link } from "react-router-dom";

const TouristPage = () => {
  return (
    <div className="tour-guide-main">
      <h1>Tourist Dashboard</h1>
      <div className="buttons-container">
        <Link to="/tourist-profile">
          <button className="role-btn">My Profile</button>
        </Link>
        <Link to="/tourist-book-itineraries">
          <button className="role-btn">Book Itineraries</button>
        </Link>
        <Link to="/tourist-book-activities">
          <button className="role-btn">Book Activities</button>
        </Link>
        <Link to="/tourist-book-museums">
          <button className="role-btn">Book Museums</button>
        </Link>
        <Link to="/savedevents">
          <button className="role-btn">Saved Events</button>
        </Link>
        <Link to="/tourist-book-flights">
          <button className="role-btn">Book Flights</button>
        </Link>
        <Link to="/tourist-preferences">
          <button className="role-btn">preferences</button>
        </Link>
      </div>
    </div>
  );
};

export default TouristPage;