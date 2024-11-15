import React, { useEffect, useState } from "react";
import axios from "axios";

const TouristBookItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [bookedItineraries, setBookedItineraries] = useState([]);
  const username = localStorage.getItem("username"); // Tourist's username from localStorage

  // Fetch itineraries and the tourist's booked itineraries on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all itineraries
        const itinerariesResponse = await axios.get(
          "http://localhost:3500/api/itineraries"
        );
        const allItineraries = itinerariesResponse.data;

        // Fetch the tourist's account details to get booked itineraries
        const touristResponse = await axios.get(
          `http://localhost:3500/api/touristsAccounts/${username}`
        );
        const { bookedItineraries } = touristResponse.data;

        // Filter out already booked itineraries
        const availableItineraries = allItineraries.filter(
          (itinerary) => !bookedItineraries.includes(itinerary.name)
        );

        setItineraries(availableItineraries);
        setBookedItineraries(bookedItineraries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  // Function to handle booking an itinerary
  const handleBooking = async (itineraryName) => {
    try {
      // Send a PATCH request to book the itinerary
      const response = await axios.patch(
        `http://localhost:3500/api/touristsAccounts/bookItinerary`,
        {
          username: username,
          itineraryName: itineraryName,
        }
      );

      if (response.status === 200) {
        // Update the UI after booking
        setBookedItineraries((prev) => [...prev, itineraryName]);
        setItineraries((prev) =>
          prev.filter((itinerary) => itinerary.name !== itineraryName)
        );
        alert("Itinerary booked successfully!");
      } else {
        alert("Failed to book itinerary.");
      }
    } catch (error) {
      console.error("Error booking itinerary:", error);
    }
  };

  return (
    <div>
      <h1>Available Itineraries</h1>
      {itineraries.length === 0 ? (
        <p>No itineraries available to book!</p>
      ) : (
        <ul>
          {itineraries.map((itinerary) => (
            <li key={itinerary._id}>
              <h3>{itinerary.name}</h3>
              <p>{itinerary.description}</p>
              <button onClick={() => handleBooking(itinerary.name)}>
                Book
              </button>
            </li>
          ))}
        </ul>
      )}
      <h2>Booked Itineraries</h2>
      <ul>
        {bookedItineraries.map((itinerary, index) => (
          <li key={index}>{itinerary}</li>
        ))}
      </ul>
    </div>
  );
};

export default TouristBookItineraries;
