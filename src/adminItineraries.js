import React, { useState, useEffect } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const AdminItineraries = () => {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    // Fetch all itineraries
    axios
      .get("http://localhost:3500/api/itineraries/admin")
      .then((response) => {
        setItineraries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching itineraries:", error);
      });
  }, []);

  const handleFlagItinerary = (id) => {
    axios
      .post(`http://localhost:3500/api/flagItinerary/${id}`)
      .then((response) => {
        alert("Itinerary flagged successfully!");
        // Update the UI
        setItineraries((prev) =>
          prev.map((itinerary) =>
            itinerary._id === id ? { ...itinerary, isFlagged: true } : itinerary
          )
        );
      })
      .catch((error) => {
        console.log("Error flagging itinerary:", error);
        console.error("Error flagging itinerary:", error);
        console.error("Error response:", error.response?.data || error.message);
        alert("Failed to flag the itinerary.");
      });
  };

  return (
    <div>
      <h1>Admin - Itineraries</h1>
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
          {itineraries.map((itinerary) => (
            <tr key={itinerary._id}>
              <td>{itinerary.name}</td>
              <td>{itinerary.duration}</td>
              <td>${itinerary.price}</td>
              <td>
                {itinerary.isFlagged ? (
                  <span>Flagged</span>
                ) : (
                  <button onClick={() => handleFlagItinerary(itinerary._id)}>
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

export default AdminItineraries;
