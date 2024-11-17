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

  // Save button handler - Save museum to "saved events" in localStorage
  const handleSave = (museum) => {
    const savedMuseums = JSON.parse(localStorage.getItem("savedMuseums")) || [];
    if (!savedMuseums.some((saved) => saved._id === museum._id)) {
      savedMuseums.push(museum);
      localStorage.setItem("savedMuseums", JSON.stringify(savedMuseums));
      alert(`You saved the museum: ${museum.name}`);
    } else {
      alert("This museum is already saved!");
    }
  };

  // Save button component
  const SaveButton = ({ museum }) => (
    <button
      onClick={() => handleSave(museum)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        marginTop: "10px",
      }}
      aria-label="Save"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-save2"
        viewBox="0 0 16 16"
      >
        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v4.5h2a.5.5 0 0 1 .354.854l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5A.5.5 0 0 1 5.5 6.5h2V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1z"/>
      </svg>
    </button>
  );

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
                <SaveButton museum={museum} />
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
