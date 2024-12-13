// SellerMainPage.js
import React from "react";
import { Link } from "react-router-dom";
import "./ButtonStyles.css"; // Optional: for button styles
import "./activityCategoryPage.css";

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
        <Link to="/create-product">
          <button className="register-btn">create product</button>
        </Link>
        <Link to="/admin-seller-view-products">
          <button className="role-btn">View products</button>
        </Link>
        <Link to="/">
          <button className="role-btn">Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default SellerMainPage;
