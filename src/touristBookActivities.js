import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristBookActivities = () => {
  const [activities, setActivities] = useState([]);
  const [bookedActivity, setBookedActivities] = useState([]);
  const username = localStorage.getItem("username");

  // Fetch activities when component mounts
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3500/api/activities"
        );
        const allActivities = response.data.data;
        //setActivities(response.data.data);

        const touristResponse = await axios.get(
          `http://localhost:3500/api/touristsAccounts/${username}`
        );
        const { bookedActivity } = touristResponse.data;
        const availableActivities = allActivities.filter(
          (activity) => !bookedActivity.includes(activity.activityName)
        );

        setActivities(availableActivities);
        setBookedActivities(bookedActivity);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [username]);

  // Handle activity booking
  const handleBookActivity = async (activityName) => {
    try {
      console.log("Request payload:", { username, activityName });

      const response = await axios.patch(
        `http://localhost:3500/api/touristsAccounts/bookActivity`,
        {
          username: username,
          activityName: activityName,
        }
      );

      if (response.status === 200) {
        // Update the UI after booking
        setBookedActivities((prev) => [...prev, activityName]);
        setActivities((prev) =>
          prev.filter((activity) => activity.activityName !== activityName)
        );
        alert("Activity booked successfully!");
      } else {
        alert("Failed to book activity.");
      }
    } catch (error) {
      console.error("Error booking activity:", error);
    }
  };

  return (
    <div>
      <h1>Available Activities</h1>
      {activities.length === 0 ? (
        <p>No Activities available to book!</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity._id}>
              <h3>{activity.activityName}</h3>
              <p>{activity.description}</p>
              <p>{activity.location}</p>
              <button onClick={() => handleBookActivity(activity.activityName)}>
                Book
              </button>
            </li>
          ))}
        </ul>
      )}
      <h2>Booked Activities</h2>
      <ul>
        {bookedActivity.map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
      </ul>
    </div>
  );
};

export default TouristBookActivities;