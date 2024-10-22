// SellerMainPage.js
import React from "react";
import { Link } from "react-router-dom";
import "./ButtonStyles.css"; // Optional: for button styles

const SellerMainPage = () => {
  return (
    <div className="seller-main-container">
      <h1>Seller Main Page</h1>
      <div className="buttons-container">
        <Link to="/seller-page">
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

export default SellerMainPage;
