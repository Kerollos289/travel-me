//MyBookings.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

function MyBookings() {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dummy touristId for testing
  const touristId = "dummyTouristId"; // Replace this with actual tourist ID or use any value for testing

  // Fetch the tourist's bookings (simulated with dummy data)
  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    // Simulating a delay like an API request would have
    setTimeout(() => {
      // Dummy data
      const dummyBookings = [
        {
          _id: "1",
          type: "Flight",
          dateTime: "2024-11-15T10:00:00.000Z",
          location: "New York",
          price: 200,
        },
        {
          _id: "2",
          type: "Train",
          dateTime: "2024-11-16T14:30:00.000Z",
          location: "Los Angeles",
          price: 100,
        },
        {
          _id: "3",
          type: "Bus",
          dateTime: "2024-11-17T08:00:00.000Z",
          location: "Chicago",
          price: 50,
        },
      ];

      // Setting dummy data to the state
      setMyBookings(dummyBookings);
      setLoading(false);
    }, 1000); // Simulate 1 second delay to mimic real API call
  };

  if (loading) {
    return <p>Loading your bookings...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>My Bookings</h2>
      <ul>
        {myBookings.length === 0 ? (
          <p>You have no bookings yet.</p>
        ) : (
          myBookings.map((booking) => (
            <li key={booking._id}>
              <p>
                <strong>Type:</strong> {booking.type}
              </p>
              <p>
                <strong>Date & Time:</strong>{" "}
                {new Date(booking.dateTime).toLocaleString()}
              </p>
              <p>
                <strong>Location:</strong> {booking.location}
              </p>
              <p>
                <strong>Price:</strong> ${booking.price}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default MyBookings;
