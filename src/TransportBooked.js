import React, { useState } from "react";
import "./activityCategoryPage.css";

const TouristBookedTransport = () => {
  const [bookings] = useState([
    {
      mode: "Car",
      company: "RideNow",
      departure: "New York",
      destination: "Boston",
      date: "2024-12-15",
      time: "10:00 AM",
      price: 120,
      currency: "USD",
      status: "Confirmed",
    },
    {
      mode: "Bus",
      company: "CityLink",
      departure: "Los Angeles",
      destination: "San Francisco",
      date: "2024-12-20",
      time: "8:00 AM",
      price: 45,
      currency: "USD",
      status: "Pending",
    },
    {
      mode: "Train",
      company: "FastRail",
      departure: "Chicago",
      destination: "Detroit",
      date: "2024-12-18",
      time: "6:30 PM",
      price: 85,
      currency: "USD",
      status: "Confirmed",
    },
  ]);

  return (
    <div>
      <h1>Booked Transportation</h1>
      {bookings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Mode</th>
              <th>Company</th>
              <th>Departure</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Currency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.mode}</td>
                <td>{booking.company}</td>
                <td>{booking.departure}</td>
                <td>{booking.destination}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>{booking.price}</td>
                <td>{booking.currency}</td>
                <td>{booking.status}</td>
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

export default TouristBookedTransport;
