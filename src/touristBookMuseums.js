import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristBookMuseums = () => {
  const [museums, setMuseums] = useState([]);
  const [bookedMuseums, setBookedMuseums] = useState(
    JSON.parse(localStorage.getItem("bookedMuseums")) || [] // Load from localStorage
  );

  // Fetch museums when component mounts
  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/museums");
        setMuseums(response.data);
      } catch (error) {
        console.error("Error fetching museums:", error);
      }
    };

    fetchMuseums();
  }, []);

  // Booking function for tourists
  const handleBookMuseum = (museum) => {
    if (bookedMuseums.some((booked) => booked._id === museum._id)) {
      alert("You have already booked this museum.");
    } else {
      const updatedBookings = [...bookedMuseums, museum];
      setBookedMuseums(updatedBookings);
      localStorage.setItem("bookedMuseums", JSON.stringify(updatedBookings)); // Save to localStorage
      alert(`You have successfully booked ${museum.name}!`);
    }
  };

  return (
    <div>
      <h2>Available Museums to Book</h2>
      {museums.length === 0 ? (
        <p>No museums available to book at the moment!</p>
      ) : (
        <ul>
          {museums.map((museum) => (
            <li key={museum._id}>
              <div>
                <h3>{museum.name}</h3>
                <p>{museum.description}</p>
                <p><strong>Location:</strong> {museum.location}</p>
                <p><strong>Opening Hours:</strong> {museum.openingHours}</p>
                <p><strong>Ticket Prices:</strong></p>
                <ul>
                  <li>Foreigner: ${museum.foreignerTicketPrice}</li>
                  <li>Student: ${museum.studentTicketPrice}</li>
                  <li>Native: ${museum.nativeTicketPrice}</li>
                </ul>
                <button onClick={() => handleBookMuseum(museum)}>Book Now</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3>Booked Museums</h3>
      {bookedMuseums.length === 0 ? (
        <p>No museums booked yet.</p>
      ) : (
        <ul>
          {bookedMuseums.map((museum) => (
            <li key={museum._id}>
              <h3>{museum.name}</h3>
              <p>{museum.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TouristBookMuseums;
