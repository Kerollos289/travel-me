// Components/FlightSearch.js
import React, { useState } from "react";
import { searchFlights } from "../src/API";
import { format } from "date-fns";
import {
  ChevronDown,
  Globe,
  Menu,
  Plane,
  Building2,
  Briefcase,
} from "lucide-react";
import CabinClassSelector from "./CabinClassSelector"; // Import the CabinClassSelector component
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the datepicker CSS
import "./activityCategoryPage.css";

const FlightSearch = ({ token, setFlights }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("ECONOMY");
  const [nonStop, setNonStop] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");
  const [max, setMax] = useState(250);
  const [message, setMessage] = useState(""); // State to hold message

  const handleSearch = async () => {
    if (!origin || !destination || !departureDate) {
      alert("Please fill in the origin, destination, and departure date.");
      return;
    }

    try {
      const flights = await searchFlights({
        token,
        origin,
        destination,
        departureDate,
        returnDate,
        adults,
        children,
        infants,
        travelClass,
        nonStop,
        maxPrice,
        max,
      });

      if (flights.length === 0) {
        setMessage("No flights found.");
      } else {
        setMessage("");
      }

      setFlights(flights);
    } catch (error) {
      console.error("Error fetching flight offers:", error);
      setMessage("An error occurred while fetching flights.");
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg p-4">
        <div className="flex gap-4 mb-4">
          <button className="w-full px-6 py-4 bg-blue-600 text-white font-bold text-xl rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center">
            <Plane className="w-5 h-5" />
            One-way Only
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="From"
            className="w-full p-3 border rounded"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
          <input
            type="text"
            placeholder="To"
            className="w-full p-3 border rounded"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          {/* DatePicker component */}
          <div className="w-full">
            <DatePicker
              selected={departureDate}
              onChange={(date) => setDepartureDate(format(date, "yyyy-MM-dd"))} // Update state when date is selected
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Departure Date"
              className="w-full p-3 border rounded" // Custom styles for the datepicker
            />
          </div>
          <input
            type="text"
            placeholder="Return"
            className="w-full p-3 border rounded"
            disabled
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-4 cursor-pointer text-gray-700 w-full">
            <input
              type="checkbox"
              className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={nonStop}
              onChange={(e) => setNonStop(e.target.checked)}
            />
            <span className="text-xl font-bold">Direct flight only</span>
          </label>

          <div className="flex gap-4 mb-4">
            <div className="flex flex-col w-full">
              <label htmlFor="adults" className="font-semibold text-lg mb-2">
                Adults
              </label>
              <input
                id="adults"
                placeholder="Adults"
                type="number"
                min="1"
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
                className="w-full p-3 border rounded"
              />
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="children" className="font-semibold text-lg mb-2">
                Children
              </label>
              <input
                id="children"
                placeholder="Children"
                type="number"
                min="0"
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                className="w-full p-3 border rounded"
              />
            </div>

            {/* <div className="flex flex-col w-full">
              <label htmlFor="infants" className="font-semibold text-lg mb-2">Infants</label>
              <input
                id="infants"
                placeholder="Infants"
                type="number"
                min="0"
                value={infants}
                onChange={(e) => setInfants(e.target.value)}
                className="w-full p-3 border rounded"
              />
            </div> */}

            <div className="flex flex-col w-full">
              <label htmlFor="infants" className="font-semibold text-lg mb-2">
                Class
              </label>
              <CabinClassSelector
                cabinClass={travelClass}
                setTravelClass={setTravelClass}
              />{" "}
              {/* Add the selector here */}
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="infants" className="font-semibold text-lg mb-2">
              Max Price
            </label>
            <input
              placeholder="Max Price"
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <button
            onClick={handleSearch}
            style={{
              backgroundImage: "linear-gradient(to right, #3b82f6, #6366f1)",
              color: "white",
              paddingLeft: "2rem",
              paddingRight: "2rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease, background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundImage =
                "linear-gradient(to right, #6366f1, #3b82f6)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundImage =
                "linear-gradient(to right, #3b82f6, #6366f1)")
            }
            onFocus={(e) =>
              (e.target.style.boxShadow = "0 0 0 2px rgba(75, 85, 99, 0.5)")
            }
            onBlur={(e) =>
              (e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)")
            }
            className="w-full ml-auto transform hover:scale-105"
          >
            Search
          </button>

          {message && <p className="text-red-500 mt-4">{message}</p>}
        </div>
      </div>
    </div>

    //new
  );
};

export default FlightSearch;
