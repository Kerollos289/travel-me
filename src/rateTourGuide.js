import React, { useState, useEffect } from "react";
import axios from "axios";

const RateTourGuide = () => {
  const [attendedItineraries, setAttendedItineraries] = useState([]);
  const [ratings, setRatings] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    // Fetch attended itineraries by username
    const fetchAttendedItineraries = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3500/api/getAttendedItineraries",
          { username }
        );
        setAttendedItineraries(response.data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchAttendedItineraries();
  }, [username]);

  const handleRatingChange = (index, field, value) => {
    const updatedRatings = [...ratings];
    const { tourGuideUsername, name: itineraryName } =
      attendedItineraries[index];
    updatedRatings[index] = {
      ...updatedRatings[index],
      [field]: value,
      tourGuideUsername,
      itineraryName,
    };
    setRatings(updatedRatings);
  };
  const handleSubmit = async () => {
    try {
      for (const {
        tourGuideUsername,
        itineraryName,
        rating,
        comment,
      } of ratings) {
        console.log("Submitting:", {
          tourGuideUsername,
          itineraryName,
          username,
          rating,
          comment,
        });

        await axios.post("http://localhost:3500/api/submitRating", {
          tourGuideUsername,
          itineraryName,
          username,
          rating,
          comment,
        });
      }
      alert("Ratings submitted successfully!");
    } catch (error) {
      console.error("Error submitting ratings:", error.response?.data || error);
      alert("Failed to submit ratings.");
    }
  };

  return (
    <div>
      <h2>Rate Tour Guides</h2>
      {attendedItineraries.map((itinerary, index) => (
        <div
          key={index}
          style={{ border: "1px solid black", margin: "10px", padding: "10px" }}
        >
          <p>
            <strong>Itinerary:</strong> {itinerary.name}
          </p>
          <p>
            <strong>Tour Guide:</strong> {itinerary.tourGuideUsername}
          </p>
          <label>
            <strong>Rating:</strong>
            <select
              value={ratings[index]?.rating || ""}
              onChange={(e) =>
                handleRatingChange(index, "rating", e.target.value)
              }
            >
              <option value="" disabled>
                Select
              </option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            <strong>Comment:</strong>
            <textarea
              value={ratings[index]?.comment || ""}
              onChange={(e) =>
                handleRatingChange(index, "comment", e.target.value)
              }
            ></textarea>
          </label>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Ratings</button>
    </div>
  );
};

export default RateTourGuide;
