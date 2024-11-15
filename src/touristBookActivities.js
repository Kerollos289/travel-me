import React, { useEffect, useState } from "react";
import axios from "axios";

const TouristBookActivities = () => {
  const [activities, setActivities] = useState([]);
  const [bookedActivities, setBookedActivities] = useState([]);
  const username = localStorage.getItem("username"); // Tourist's username from localStorage

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const activitiesResponse = await axios.get(
  //           "http://localhost:3500/api/activities"
  //         );
  //         const allActivities = activitiesResponse.data;

  //         const touristResponse = await axios.get(
  //           `http://localhost:3500/api/touristsAccounts/${username}`
  //         );
  //         const { bookedActivities } = touristResponse.data;

  //         const availableActivities = allActivities.filter(
  //           (activity) => !bookedActivities.includes(activity.name)
  //         );

  //         setActivities(availableActivities);
  //         setBookedActivities(bookedActivities);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };

  //     fetchData();
  //   }, [username]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all activities
        const activitiesResponse = await axios.get(
          "http://localhost:3500/api/activities"
        );
        const allActivities = activitiesResponse.data.data; // Adjust this if needed

        // Fetch tourist's booked activities
        const touristResponse = await axios.get(
          `http://localhost:3500/api/touristsAccounts/${username}`
        );
        const { bookedActivities } = touristResponse.data; // Adjust this if needed

        // Filter activities to show only available ones
        const availableActivities = allActivities.filter(
          (activity) => !bookedActivities.includes(activity.activityName) // Match the correct property
        );

        setActivities(availableActivities); // Update state with available activities
        setBookedActivities(bookedActivities); // Update state with booked activities
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (username) {
      fetchData(); // Only fetch data if username is defined
    }
  }, [username]);

  const handleBooking = async (activityName) => {
    try {
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
          prev.filter((activity) => activity.name !== activityName)
        );
        alert("Activity booked successfully!");
      } else {
        alert("Failed to book Activity.");
      }
    } catch (error) {
      console.error("Error booking activity:", error);
    }
  };
  return (
    <div>
      <h1>Available Activities</h1>
      {activities.length === 0 ? (
        <p>No activities available to book!</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity._id}>
              <h3>{activity.name}</h3>
              <p>{activity.description}</p>
              <button onClick={() => handleBooking(activity.name)}>Book</button>
            </li>
          ))}
        </ul>
      )}
      <h2>Booked Activities</h2>
      <ul>
        {bookedActivities.map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
      </ul>
    </div>
  );
};

export default TouristBookActivities;
