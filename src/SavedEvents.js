import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./activityCategoryPage.css";

const SavedEvents = () => {
  const [savedMuseums, setSavedMuseums] = useState([]);
  const [savedActivities, setSavedActivities] = useState([]);

  // Load saved museums and activities from localStorage
  useEffect(() => {
    const savedMuseumsData =
      JSON.parse(localStorage.getItem("savedMuseums")) || [];
    setSavedMuseums(savedMuseumsData);

    const savedActivitiesData =
      JSON.parse(localStorage.getItem("savedActivities")) || [];
    setSavedActivities(savedActivitiesData);
  }, []);

  return (
    <div>
      <h2>Saved Museums</h2>
      {savedMuseums.length === 0 ? (
        <p>No saved museums!</p>
      ) : (
        <ul>
          {savedMuseums.map((museum) => (
            <li key={museum._id}>
              <h3>{museum.name}</h3>
              <p>{museum.location}</p>
              <p>{museum.description}</p>
              <p>
                <strong>Foreigner Price:</strong> ${museum.foreignerTicketPrice}
              </p>
              <p>
                <strong>Student Price:</strong> ${museum.studentTicketPrice}
              </p>
              <p>
                <strong>Native Price:</strong> ${museum.nativeTicketPrice}
              </p>
            </li>
          ))}
        </ul>
      )}

      <h2>Saved Activities</h2>
      {savedActivities.length === 0 ? (
        <p>No saved activities!</p>
      ) : (
        <ul>
          {savedActivities.map((activity) => (
            <li key={activity._id}>
              <h3>{activity.activityName}</h3>
              <p>{activity.location}</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(activity.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {activity.time}
              </p>
              <p>
                <strong>Price:</strong> ${activity.price}
              </p>
              <p>
                <strong>Category:</strong> {activity.category}
              </p>
              <p>
                <strong>Tags:</strong> {activity.tags.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedEvents;
