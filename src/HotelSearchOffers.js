import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { fetchAccessToken, getHotelOffersById } from "../src/hotelAPI";
const username = localStorage.getItem("username");

const BookingPage = () => {
  const { hotelId, touristId } = useParams();

  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [adults, setAdults] = useState(1);
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [hotelOffers, setHotelOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fetchedToken = await fetchAccessToken();
        setToken(fetchedToken);
      } catch (error) {
        console.error("Error fetching access token:", error);
        setMessage("Error fetching access token");
      }
    };

    fetchToken();
  }, []);

  const handleSearchClick = async () => {
    if (!token) {
      setMessage("Error: Access token is missing.");
      return;
    }

    setLoading(true);
    setMessage("");
    setHotelOffers([]); // Reset before making a new request

    try {
      const formattedCheckInDate = checkInDate.toISOString().split("T")[0];
      const formattedCheckOutDate = checkOutDate.toISOString().split("T")[0];

      const response = await getHotelOffersById({
        token,
        hotelId: hotelId,
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        adults: parseInt(adults, 10),
        roomQuantity: parseInt(roomQuantity, 10),
        currency: "USD",
      });

      console.log("Hotel Offers:", response);

      // Assuming response.data contains offers directly
      if (
        response &&
        response[0] &&
        response[0].offers &&
        response[0].offers.length > 0
      ) {
        setHotelOffers(response[0].offers); // Correctly set the offers from the response
      } else {
        setMessage("No offers found for the selected dates and parameters.");
      }
    } catch (error) {
      console.error("Error fetching hotel offers:", error);
      setMessage("Failed to fetch hotel offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = async (offer) => {
    const { roomType, price, currency, checkInDate, checkOutDate } = offer;

    try {
      const response = await axios.post(
        `http://localhost:3500/bookHotel/${username}`,
        {
          hotelId: hotelId,
          roomType: offer?.room?.description?.text,
          price: offer?.price?.base,
          currency: offer?.price?.currency,
          checkInDate: offer.checkInDate,
          checkOutDate: offer.checkOutDate,
        }
      );

      console.log("Booking successful:", response.data);
      alert(`Booking successful!`);
    } catch (error) {
      console.error("Error booking hotel:", error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-xl mx-auto mt-8">
      <h3 className="text-2xl font-semibold mb-4 text-center">Hotel Booking</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="checkInDate"
            className="block text-sm font-medium text-gray-600"
          >
            Check-In Date
          </label>
          <DatePicker
            id="checkInDate"
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select Check-In Date"
            className="w-full p-3 border rounded mt-1"
          />
        </div>

        <div>
          <label
            htmlFor="checkOutDate"
            className="block text-sm font-medium text-gray-600"
          >
            Check-Out Date
          </label>
          <DatePicker
            id="checkOutDate"
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select Check-Out Date"
            className="w-full p-3 border rounded mt-1"
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="adults"
          className="block text-sm font-medium text-gray-600"
        >
          Number of Adults
        </label>
        <input
          id="adults"
          type="number"
          value={adults}
          min="1"
          onChange={(e) => setAdults(e.target.value)}
          placeholder="Enter number of adults"
          className="w-full p-3 border rounded mt-1"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="roomQuantity"
          className="block text-sm font-medium text-gray-600"
        >
          Number of Rooms
        </label>
        <input
          id="roomQuantity"
          type="number"
          value={roomQuantity}
          min="1"
          onChange={(e) => setRoomQuantity(e.target.value)}
          placeholder="Enter number of rooms"
          className="w-full p-3 border rounded mt-1"
        />
      </div>

      <button
        onClick={handleSearchClick}
        className="bg-blue-600 text-white px-6 py-3 rounded-full w-full mt-4 hover:bg-blue-700"
      >
        Search Offers
      </button>

      {loading && (
        <p className="mt-4 text-center text-gray-500">Loading offers...</p>
      )}
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}

      {hotelOffers.length > 0 ? (
        <div className="mt-6">
          <h4 className="text-xl font-semibold mb-4">Hotel Offers</h4>
          {hotelOffers.map((offer, index) => (
            <div key={index} className="border p-4 mb-6 rounded-lg shadow-md">
              <h5 className="font-semibold text-lg">{offer?.hotel?.name}</h5>
              <p>
                <strong>Price:</strong> {offer?.price?.base}{" "}
                {offer?.price?.currency}
              </p>
              <p>
                <strong>Check-In Date:</strong> {offer?.checkInDate}
              </p>
              <p>
                <strong>Check-Out Date:</strong> {offer?.checkOutDate}
              </p>
              <p>
                <strong>Room Type:</strong> {offer?.room?.description?.text}
              </p>
              <button
                onClick={() => handleBookClick(offer)}
                className="bg-green-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-green-700"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No hotel offers available.</p>
      )}
    </div>
  );
};

export default BookingPage;
