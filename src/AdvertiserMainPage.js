//AdvertiserMainPage.js
import React from "react";
import { Link } from "react-router-dom";
import "./ButtonStyles.css";

const AdvertiserMainPage = () => {
  return (
    <div className="advertiser-main-container">
      <h1>Advertiser Dashboard</h1>
      <div className="buttons-container">
        <Link to="/advertiser">
          <button className="role-btn">Activities</button>
        </Link>
        <Link to="/advertiser-profile">
          <button className="role-btn">My Profile</button>
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

export default AdvertiserMainPage;
