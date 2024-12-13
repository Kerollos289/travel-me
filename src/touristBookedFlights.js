import React, { useEffect, useState } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const TouristBookedFlights = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve the username from local storage
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3500/getFlightBookings/${username}`
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
      <h1>{username}'s Booked Flights</h1>
      {bookings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Airline</th>
              <th>Flight Number (1st Leg)</th>
              <th>Departure (1st Leg)</th>
              <th>Arrival (1st Leg)</th>
              <th>Flight Number (2nd Leg)</th>
              <th>Departure (2nd Leg)</th>
              <th>Arrival (2nd Leg)</th>
              <th>Price</th>
              <th>Currency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.airline || "N/A"}</td>
                <td>{booking.flightNumber1 || "N/A"}</td>
                <td>
                  {new Date(booking.departure1).toLocaleString() || "N/A"}
                </td>
                <td>{new Date(booking.arrival1).toLocaleString() || "N/A"}</td>
                <td>{booking.flightNumber2 || "N/A"}</td>
                <td>
                  {booking.departure2
                    ? new Date(booking.departure2).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  {booking.arrival2
                    ? new Date(booking.arrival2).toLocaleString()
                    : "N/A"}
                </td>
                <td>{booking.price || "N/A"}</td>
                <td>{booking.currency || "N/A"}</td>
                <td>{booking.status || "N/A"}</td>
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

export default TouristBookedFlights;
