//AdvertiserMainPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ButtonStyles.css";
const AdvertiserMainPage = () => {
  const [notifications, setNotifications] = useState([]);
  const username = localStorage.getItem("username"); // Assuming username is stored in localStorage
  console.log("Username from localStorage:", username);

  useEffect(() => {
    const fetchFlaggedActivities = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3500/api/activities/flagged-activities/${username}`
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching flagged activities:", error);
      }
    };
    fetchFlaggedActivities();
  }, [username]);

  // Close notification
  const closeNotification = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3500/api/activities/close-notification/${id}`
      );
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error closing notification:", error);
    }
  };

  return (
    <div className="advertiser-main-container">
      <h1>Advertiser Dashboard</h1>

      <div
        className="notifications-container"
        style={{ position: "fixed", top: "10px", right: "10px" }}
      >
        {notifications.map((notif) => (
          <div key={notif._id} className="notification">
            <p>{`Your activity "${notif.activityName}" has been flagged.`}</p>
            <button onClick={() => closeNotification(notif._id)}>Close</button>
          </div>
        ))}
      </div>

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
        <Link to="/activity">
          <button className="role-btn">Activities</button>
        </Link>
        <Link to="/advertiser-report">
          <button className="role-btn">Report</button>
        </Link>
        <Link to="/">
          <button className="role-btn">Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default AdvertiserMainPage;
