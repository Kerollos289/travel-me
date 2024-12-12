// touristPage.js
import React from "react";
import { Link } from "react-router-dom";
import vid from "../src/vids/demo.mp4";

const TouristPage = () => {
  return (
    <div className="tour-guide-main">
      <h1>Tourist Dashboard</h1>
      <div className="video-container">
        <h2>Watch our Introduction Video</h2>
        <video src={vid} controls />
      </div>
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
        <Link to="/flight-main">
          <button className="role-btn">Book Flights</button>
        </Link>
        <Link to="/tourist-booked-flights">
          <button className="role-btn">Booked Flights</button>
        </Link>
        <Link to="/hotel-main">
          <button className="role-btn">Book Hotels</button>
        </Link>
        <Link to="/tourist-booked-hotels">
          <button className="role-btn">Booked Hotels</button>
        </Link>
        <Link to="/tourist-preferences">
          <button className="role-btn">preferences</button>
        </Link>
        <Link to="/tourist-bookmarked-activities">
          <button className="role-btn">bookmarked activities</button>
        </Link>
        <Link to="/activities2">
          <button className="role-btn">Available Activities</button>
        </Link>
        <Link to="/itineraries2">
          <button className="role-btn">Available Itineraries</button>
        </Link>
        <Link to="/museums2">
          <button className="role-btn">
            Available Museums and Historical Places
          </button>
        </Link>
        <Link to="/rate-tour-guide">
          <button className="register-btn">Rate Tour Guide</button>
        </Link>
        <Link to="/tourist-file-complaint">
        <Link to="/reqpromo">
          <button className="role-btn">Get Promo Codes</button>
        </Link>
        <Link to="/applypromo">
          <button className="role-btn">Use Promo Codes</button>
        </Link>
          <button className="register-btn">File Complaint</button>
        </Link>
        <Link to="/tourist-view-complaint">
          <button className="register-btn">view Complaint</button>
        </Link>
        <Link to="/tourist-view-products">
          <button className="register-btn">view products</button>
        </Link>
        <Link to="/tourist-view-wishlist">
          <button className="register-btn">view wishlist</button>
        </Link>
        <Link to="/tourist-cart">
          <button className="register-btn">view cart</button>
        </Link>
      </div>
    </div>
  );
};

export default TouristPage;
