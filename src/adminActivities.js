import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3500/api/activities/admin")
      .then((response) => {
        setActivities(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, []);

  const handleFlagActivity = (id) => {
    axios
      .post(`http://localhost:3500/api/flagActivity/${id}`)
      .then((response) => {
        alert("activities flagged successfully!");
        // Update the UI
        setActivities((prev) =>
          prev.map((activity) =>
            activity._id === id ? { ...activity, isFlagged: true } : activity
          )
        );
      })
      .catch((error) => {
        console.log("Error flagging activity:", error);
        console.error("Error flagging activity:", error);
        console.error("Error response:", error.response?.data || error.message);
        alert("Failed to flag the activity.");
      });
  };

  return (
    <div>
      <h1>Admin - Activities</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity._id}>
              <td>{activity.activityName}</td>
              <td>{activity.duration}</td>
              <td>${activity.price}</td>
              <td>
                {activity.isFlagged ? (
                  <span>Flagged</span>
                ) : (
                  <button onClick={() => handleFlagActivity(activity._id)}>
                    Flag
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminActivities;
