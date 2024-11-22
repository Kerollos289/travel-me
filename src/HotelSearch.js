import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { getHotelIdsByCity } from "../src/hotelAPI"; // API function to get hotel data
import { useParams } from "react-router-dom"; // Correct import here
const username = localStorage.getItem("username");

const HotelSearch = ({ token }) => {
  const [cityCode, setCityCode] = useState("");
  const { touristId } = useParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook for navigation

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch hotels by city code using the API function
      const hotelData = await getHotelIdsByCity(token, cityCode);
      console.log("Hotel data:", hotelData); // Log the full hotel data to check structure
      setHotels(hotelData);
    } catch (err) {
      setError("Failed to fetch hotels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHotelClick = (hotelId) => {
    // Redirect to the hotel offers page with the selected hotel ID and tourist ID
    navigate(`/HotelOffers/${hotelId}/${username}`);
  };

  return (
    <div className="hotel-search-container">
      <h3 className="search-heading">Search Hotels</h3>
      <input
        type="text"
        placeholder="Enter city code (e.g., NYC)"
        value={cityCode}
        onChange={(e) => setCityCode(e.target.value)}
        className="search-input"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="search-button"
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p className="error-message">{error}</p>}

      <div className="hotel-list">
        {hotels?.length > 0 ? (
          hotels.map((hotel) => {
            const hotelDetails = {
              name: hotel.name || "No name available", // Fallback if hotel name is missing
              location: hotel.location || "Location not available",
              distance: hotel.distance || "Distance not available",
              longitude: hotel.longitude || "Longitude not available",
              latitude: hotel.latitude || "Latitude not available",
            };

            return (
              <div
                key={hotel.hotelId}
                className="hotel-item"
                onClick={() => handleHotelClick(hotel.id)} // Call handleHotelClick with the hotel ID
              >
                <h4 className="hotel-name">{hotelDetails.name}</h4>
                <p className="hotel-location">
                  <strong>Location:</strong> {hotelDetails.location}
                </p>
                <p className="hotel-distance">
                  <strong>Distance:</strong> {hotelDetails.distance}
                </p>
                <p className="hotel-coordinates">
                  <strong>Coordinates:</strong> {hotelDetails.latitude},{" "}
                  {hotelDetails.longitude}
                </p>
              </div>
            );
          })
        ) : (
          <p>No hotels found.</p>
        )}
      </div>
    </div>
  );
};

export default HotelSearch;
