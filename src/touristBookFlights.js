import React, { useState } from "react";
import axios from "axios";

const FlightBooking = ({ flight, touristId }) => {
  const [message, setMessage] = useState("");
  const username = localStorage.getItem("username");

  const handleBookFlight = async () => {
    try {
      const segments = flight.itineraries[0]?.segments || [];
      const firstSegment = segments[0] || {};
      const secondSegment = segments[1] || {};

      // Sending POST request to the correct backend route
      const response = await axios.post(
        `http://localhost:3500/bookFlight/${username}`,
        {
          airline: flight.validatingAirlineCodes[0],
          flightNumber1: firstSegment?.carrierCode + firstSegment?.number,
          departure1: firstSegment?.departure?.at,
          arrival1: firstSegment?.arrival?.at,
          flightNumber2: secondSegment?.carrierCode + secondSegment?.number,
          departure2: secondSegment?.departure?.at,
          arrival2: secondSegment?.arrival?.at,
          price: flight.price?.grandTotal,
          currency: flight.price?.currency,
        }
      );

      // Display success message upon successful booking
      alert(`You have successfully booked your flight!`);
    } catch (error) {
      console.error("Error booking flight:", error);
      alert("Sorry, there was an issue booking your flight. Please try again.");
    }
  };

  if (!flight) return <div>Select a flight to book.</div>;

  return (
    <div>
      <h3>Booking: {flight.validatingAirlineCodes[0]}</h3>
      <p>
        Flight: {flight.itineraries[0]?.segments[0]?.carrierCode}{" "}
        {flight.itineraries[0]?.segments[0]?.number}
      </p>
      <button onClick={handleBookFlight}>Book Flight</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default FlightBooking;
