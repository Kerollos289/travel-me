import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ButtonStyles.css";

const TourGuideMainPage = () => {
  const [notifications, setNotifications] = useState([]);
  const username = localStorage.getItem("username"); // Assuming username is stored in localStorage

  // Fetch flagged itineraries
  useEffect(() => {
    const fetchFlaggedItineraries = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3500/api/itineraries/flagged-itineraries/${username}`
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching flagged itineraries:", error);
      }
    };
    fetchFlaggedItineraries();
  }, [username]);

  // Close notification
  const closeNotification = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3500/api/itineraries/close-notification/${id}`
      );
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error closing notification:", error);
    }
  };

  return (
    <div className="tour-guide-main">
      <h1>Tour Guide Dashboard</h1>

      {/* Notifications */}
      <div
        className="notifications-container"
        style={{ position: "fixed", top: "10px", right: "10px" }}
      >
        {notifications.map((notif) => (
          <div key={notif._id} className="notification">
            <p>{`Your itinerary "${notif.name}" has been flagged.`}</p>
            <button onClick={() => closeNotification(notif._id)}>Close</button>
          </div>
        ))}
      </div>

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
        <Link to="/tour-guide-report">
          <button className="role-btn">Report</button>
        </Link>
        <Link to="/">
          <button className="role-btn">Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default TourGuideMainPage;
