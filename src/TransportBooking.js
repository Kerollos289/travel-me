import React from "react";
import "./activityCategoryPage.css";

const TransportBooking = () => {
  // Mock transport data for all types
  const transportData = [
    {
      type: "Bus",
      provider: "City Transit",
      route: "Downtown to Uptown",
      departure: "2024-12-15T08:00:00",
      arrival: "2024-12-15T10:00:00",
      price: "15.00",
      currency: "USD",
    },
    {
      type: "Car",
      provider: "RideShare Co.",
      route: "Berlin to Leipzig",
      departure: "2024-12-15T12:00:00",
      arrival: "2024-12-15T14:00:00",
      price: "30.00",
      currency: "USD",
    },
    {
      type: "Train",
      provider: "National Rail",
      route: "New York to Washington",
      departure: "2024-12-16T09:00:00",
      arrival: "2024-12-16T13:00:00",
      price: "50.00",
      currency: "USD",
    },
  ];

  return (
    <div>
      <h1>Available Transport Options</h1>
      {transportData.map((transport, index) => (
        <div key={index} className="transport-card">
          <h3>{transport.type}</h3>
          <p>Provider: {transport.provider}</p>
          <p>Route: {transport.route}</p>
          <p>
            Departure: {new Date(transport.departure).toLocaleString() || "N/A"}
          </p>
          <p>
            Arrival: {new Date(transport.arrival).toLocaleString() || "N/A"}
          </p>
          <p>
            Price: {transport.price} {transport.currency}
          </p>
          <button onClick={() => alert(`Booked ${transport.type} successfully!`)}>
            Book {transport.type}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TransportBooking;
