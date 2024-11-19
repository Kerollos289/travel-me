import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristBookMuseums = () => {
  const [museums, setMuseums] = useState([]);
  const [bookedMuseums, setBookedMuseums] = useState(
    JSON.parse(localStorage.getItem("bookedMuseums")) || [] // Load from localStorage
  );
  const [filter, setFilter] = useState({
    name: "",
    locationType: "",
  });

  // Fetch museums with applied filters
  useEffect(() => {
    const fetchMuseums = async () => {
      console.log("Filter being sent to the backend:", filter); // Log the filter
      try {
        const response = await axios.get(
          "http://localhost:3500/api/museumsFilter",
          {
            params: filter, // Pass the filter to the backend API
          }
        );
        setMuseums(response.data);
      } catch (error) {
        console.error("Error fetching museums:", error);
      }
    };

    fetchMuseums();
  }, [filter]); // Re-fetch whenever the filter changes

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

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  // Save button handler
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

  // Share via email handler
  const handleShareViaMail = (museum) => {
    const subject = `Check out this museum: ${museum.name}`;
    const body = `I found this amazing museum: ${museum.name}. Here's the description: ${museum.description}. Location: ${museum.location}. Check it out!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  // Share via link handler
  const handleShareViaLink = (museum) => {
    const museumUrl = window.location.href + `?museumId=${museum._id}`;
    const shareText = `Check out this museum: ${museum.name}. Location: ${museum.location}. Description: ${museum.description}`;
    const link = `${museumUrl}&shareText=${encodeURIComponent(shareText)}`;
    prompt("Share this link with others:", link); // Show the link in a prompt to copy
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
        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v4.5h2a.5.5 0 0 1 .354.854l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5A.5.5 0 0 1 5.5 6.5h2V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1z" />
      </svg>
    </button>
  );

  return (
    <div>
      <h2>Available Museums to Book</h2>

      {/* Filters */}
      <div>
        <input
          type="text"
          name="name"
          value={filter.name}
          onChange={handleFilterChange}
          placeholder="Filter by name"
        />
        <select
          name="locationType"
          value={filter.locationType}
          onChange={handleFilterChange}
        >
          <option value="">Filter by category</option>
          <option value="Monuments">Monuments</option>
          <option value="Museums">Museums</option>
          <option value="Religious Sites">Religious Sites</option>
          <option value="Palaces/Castles">Palaces/Castles</option>
        </select>
      </div>

      {museums.length === 0 ? (
        <p>No museums available to book at the moment!</p>
      ) : (
        <ul>
          {museums.map((museum) => (
            <li key={museum._id}>
              <div>
                <h3>{museum.name}</h3>
                <p>{museum.description}</p>
                <p>
                  <strong>Location:</strong> {museum.location}
                </p>
                <p>
                  <strong>Opening Hours:</strong> {museum.openingHours}
                </p>
                <p>
                  <strong>Ticket Prices:</strong>
                </p>
                <ul>
                  <li>Foreigner: ${museum.foreignerTicketPrice}</li>
                  <li>Student: ${museum.studentTicketPrice}</li>
                  <li>Native: ${museum.nativeTicketPrice}</li>
                </ul>
                <button onClick={() => handleBookMuseum(museum)}>
                  Book Now
                </button>
                <SaveButton museum={museum} />

                {/* Share Buttons */}
                <div>
                  <button onClick={() => handleShareViaMail(museum)}>
                    Share via Mail
                  </button>
                  <button onClick={() => handleShareViaLink(museum)}>
                    Share via Link
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3>Booked Museums</h3>
      {bookedMuseums.length === 0 ? (
        <p>No museums booked yet!</p>
      ) : (
        <ul>
          {bookedMuseums.map((museum) => (
            <li key={museum._id}>
              <p>{museum.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TouristBookMuseums;
