import React, { useState, useEffect } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const AdminCount = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersThisMonth, setUsersThisMonth] = useState(0);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3500/api/user-counts"
        );
        setTotalUsers(response.data.totalUsers);
        setUsersThisMonth(response.data.usersThisMonth);
      } catch (error) {
        console.error("Error fetching user counts:", error);
      }
    };

    fetchUserCounts();
  }, []);

  return (
    <div className="admin-count-container">
      <h1>Admin Dashboard</h1>
      <div className="count-display">
        <h2>Total Users: {totalUsers}</h2>
        <h2>Users Registered This Month: {usersThisMonth}</h2>
      </div>
    </div>
  );
};

export default AdminCount;
