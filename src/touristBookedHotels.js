import React, { useEffect, useState } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const TouristBookedHotels = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3500/getHotelBookings/${username}`
        );
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{username}'s Booked Hotels</h1>
      {bookings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Hotel Name</th>
              <th>Address</th>
              <th>Room Type</th>
              <th>Price</th>
              <th>Currency</th>
              <th>Check-In Date</th>
              <th>Check-Out Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.name || "Unnamed Hotel"}</td>
                <td>{booking.address || "Unknown"}</td>
                <td>{booking.roomType || "N/A"}</td>
                <td>{booking.price || "N/A"}</td>
                <td>{booking.currency || "N/A"}</td>
                <td>{booking.checkInDate || "N/A"}</td>
                <td>{booking.checkOutDate || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default TouristBookedHotels;
