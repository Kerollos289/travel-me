import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
// import profileIcon from "../../Assets/Profile.png";

import AccessToken from "../src/HotelAccessToken";
import HotelSearch from "../src/HotelSearch"; // For hotel search functionality
import "./activityCategoryPage.css";

const HotelMain = () => {
  const [token, setToken] = useState("");
  const { touristId } = useParams();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isSignedUp, setIsSignedUp] = useState(true); // You might want to get this from a global state or context
  const username = localStorage.getItem("username");

  const navigate = useNavigate(); // For navigation to booking page

  // Adjusted function to get hotel details based on the new data structure
  const getHotelDetails = (hotel) => {
    return {
      name: hotel.name,
      address: hotel.address.countryCode, // Using countryCode from the address object
      latitude: hotel.geoCode.latitude,
      longitude: hotel.geoCode.longitude,
      distance: hotel.distance
        ? `${hotel.distance.value} ${hotel.distance.unit}`
        : "",
      lastUpdate: hotel.lastUpdate,
    };
  };

  const handleSignOut = () => {
    // Implement your sign out logic here
    setIsSignedUp(false);
    // You might want to clear user data, tokens, etc.
  };

  const handleViewDetails = () => {
    navigate(`/TouristDetails/${username}`);
  };

  const handleViewPurchasedDetails = () => {
    navigate(`/PurchasedProducts/${username}`);
  };

  const handleViewProductsDetails = () => {
    navigate(`/ProductTourist/${username}`);
  };

  const handleHotelSelect = (hotel) => {
    // When a hotel is clicked, set it as selected and navigate to the booking page
    setSelectedHotel(hotel);
    navigate(`/HotelBooking/${hotel.hotelId}`); // Using hotelId for booking page URL
  };

  // Function to go back to the previous page
  const handleBackClick = () => {
    navigate(-1); // This will take the user back to the previous page in the browser history
  };

  return (
    <div className="min-w-full px-4 py-8">
      <header className="bg-white shadow-md ">
        <nav className="bg-white shadow-md" style={{ marginBottom: "30px" }}>
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold"></div>
          </div>
        </nav>
      </header>
      <h1 className="text-3xl font-bold text-center mb-8">Hotel Booking</h1>

      {!token ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <h2 className="text-xl font-semibold mb-4">Access Token Required</h2>
          <AccessToken setToken={setToken} />
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full">
            <h2 className="text-xl font-semibold mb-4">Search Hotels</h2>
            <HotelSearch token={token} setHotels={setHotels} />
          </div>

          {hotels?.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full">
              <h2 className="text-xl font-semibold mb-4">Hotel Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotels.map((hotel) => {
                  const details = getHotelDetails(hotel);
                  return (
                    <div
                      key={hotel.hotelId} // Using hotelId as the key for each hotel card
                      className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                      onClick={() => handleHotelSelect(hotel)}
                    >
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {details.name}
                          </h3>
                          <p className="mt-2 text-sm text-gray-600">
                            Address: {details.address}
                          </p>
                          <p className="mt-2 text-sm text-gray-600">
                            Distance: {details.distance}
                          </p>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">
                            Last Update: {details.lastUpdate}
                          </p>
                          <button className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HotelMain;
