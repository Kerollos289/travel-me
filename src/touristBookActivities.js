import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristBookActivities = () => {
  const [activities, setActivities] = useState([]);
  const [bookedActivities, setBookedActivities] = useState(
    JSON.parse(localStorage.getItem("bookedActivities")) || [] // Load from localStorage
  );

  // Fetch activities when component mounts
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/activities");
        setActivities(response.data.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  // Handle activity booking
  const handleBookActivity = (activity) => {
    if (bookedActivities.some((booked) => booked._id === activity._id)) {
      alert("You have already booked this activity.");
    } else {
      const updatedBookings = [...bookedActivities, activity];
      setBookedActivities(updatedBookings);
      localStorage.setItem("bookedActivities", JSON.stringify(updatedBookings)); // Save to localStorage
      alert(`You have successfully booked ${activity.activityName}!`);
    }
  };

  return (
    <div>
      <h2>Available Activities to Book</h2>
      {activities.length === 0 ? (
        <p>No activities available to book at the moment!</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity._id}>
              <div>
                <h3>{activity.activityName}</h3>
                <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {activity.time}</p>
                <p><strong>Location:</strong> {activity.location}</p>
                <p><strong>Price:</strong> ${activity.price}</p>
                <p><strong>Category:</strong> {activity.category}</p>
                <p><strong>Tags:</strong> {activity.tags.join(", ")}</p>
                <button onClick={() => handleBookActivity(activity)}>Book Now</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3>Booked Activities</h3>
      {bookedActivities.length === 0 ? (
        <p>No activities booked yet.</p>
      ) : (
        <ul>
          {bookedActivities.map((activity) => (
            <li key={activity._id}>
              <h3>{activity.activityName}</h3>
              <p>{activity.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TouristBookActivities;
