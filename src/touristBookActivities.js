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

  const handleSaveActivity = (activity) => {
    const savedActivities = JSON.parse(localStorage.getItem("savedActivities")) || [];
    if (!savedActivities.some((saved) => saved._id === activity._id)) {
      savedActivities.push(activity);
      localStorage.setItem("savedActivities", JSON.stringify(savedActivities));
      alert(`You saved the activity: ${activity.activityName}`);
    } else {
      alert("This activity is already saved!");
    }
  };

  // Save button component
  const SaveButton = ({ activity }) => (
    <button
      onClick={() => handleSaveActivity(activity)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        marginTop: "10px",
      }}
      aria-label="Save"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-save2"
        viewBox="0 0 16 16"
      >
        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v4.5h2a.5.5 0 0 1 .354.854l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5A.5.5 0 0 1 5.5 6.5h2V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1z"/>
      </svg>
    </button>
  );

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
                <SaveButton activity={activity} /> {/* Render Save Button here */}
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
