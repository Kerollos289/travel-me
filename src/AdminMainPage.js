import React from "react";
import { Link } from "react-router-dom";
// import "./AdminMainPage.css"; // Optional: Create a CSS file for styling

const AdminMainPage = () => {
  return (
    <div className="admin-main-container">
      <h1>Admin Main Page</h1>
      <div className="buttons-container">
        <Link to="/admin">
          <button className="role-btn">Admin Documents</button>
        </Link>
        <Link to="/admin-create">
          <button className="role-btn">Admin Create Account</button>
        </Link>
        <Link to="/admin-delete">
          <button className="role-btn">Admin Delete</button>
        </Link>
        <Link to="/admin-delete-request">
          <button className="role-btn">Admin Delete Request</button>
        </Link>
        <Link to="/activity-categories">
          <button className="role-btn">Activity Categories</button>
        </Link>
        <Link to="/preference-tags">
          <button className="role-btn">Preference Tags</button>
        </Link>
        <Link to="/sales-page">
          <button className="role-btn">Sales Report</button>
        </Link>
        <Link to="/admin-itineraries">
          <button className="register-btn">Itineraries</button>
        </Link>
        <Link to="/admin-activities">
          <button className="register-btn">Activities</button>
        </Link>
        <Link to="/admin-count">
          <button className="register-btn">Users Count</button>
        </Link>
        <Link to="/create-product">
          <button className="register-btn">create product</button>
        </Link>
        <Link to="/">
          <button className="role-btn">Back to Home</button>
        </Link>
        <Link to="/admin-view-complaint">
          <button className="role-btn">View Complaints</button>
        </Link>
      </div>
    </div>
  );
};

export default AdminMainPage;
