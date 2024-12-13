//AvailableBookings.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

function AvailableBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the available bookings when the component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3500/api/bookings/available"
      );
      console.log("Available Bookings:", response.data);
      if (response.data && response.data.data) {
        setBookings(response.data.data);
      } else {
        setError("No available bookings at the moment.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings.");
      setLoading(false);
    }
  };

  // Book a transportation option
  const bookTransportation = async (bookingId) => {
    const touristId = "TOURIST_ID"; // Replace this with actual tourist ID, which should be fetched from session or auth context

    try {
      const response = await axios.post(
        `http://localhost:3500/api/bookings/book/${bookingId}`,
        { touristId }
      );
      alert("Booking reserved successfully!");
      fetchBookings(); // Refresh the available bookings list after booking
    } catch (err) {
      console.error("Error booking transportation:", err);
      alert("Failed to reserve the booking.");
    }
  };

  if (loading) {
    return <p>Loading available bookings...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Available Bookings</h2>
      <ul>
        {bookings.length === 0 ? (
          <p>No available bookings at the moment.</p>
        ) : (
          bookings.map((booking) => (
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
              <button
                onClick={() => bookTransportation(booking._id)}
                disabled={booking.isBooked}
              >
                {booking.isBooked ? "Already Booked" : "Book Now"}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default AvailableBookings;
