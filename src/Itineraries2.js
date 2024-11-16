//Itineraries2.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const ItineraryPage2 = () => {
  const [itineraries, setItineraries] = useState([]);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 10000 });
  const [dateFilter, setDateFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [preferencesFilter, setPreferencesFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort by ascending price

  // Fetch all itineraries on component mount
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/itineraries");
        setItineraries(response.data); // Set state with fetched itineraries
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };
    fetchItineraries();
  }, []);

  // Apply filters and sorting
  const filteredAndSortedItineraries = itineraries
    .filter((itinerary) => {
      // Filter by price
      const priceInRange =
        itinerary.price >= priceFilter.min && itinerary.price <= priceFilter.max;

      // Filter by date
      const dateMatch = dateFilter
        ? itinerary.availableDates.some((date) => date.includes(dateFilter))
        : true;

      // Filter by language
      const languageMatch =
        languageFilter ? itinerary.language.includes(languageFilter) : true;

      // Filter by preferences (you can adjust preferences logic as needed)
      const preferencesMatch =
        preferencesFilter
          ? itinerary.activities.toLowerCase().includes(preferencesFilter.toLowerCase())
          : true;

      return priceInRange && dateMatch && languageMatch && preferencesMatch;
    })
    .sort((a, b) => {
      // Sort by price based on sortOrder
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "priceMin" || name === "priceMax") {
      setPriceFilter({
        ...priceFilter,
        [name === "priceMin" ? "min" : "max"]: value,
      });
    } else if (name === "date") {
      setDateFilter(value);
    } else if (name === "language") {
      setLanguageFilter(value);
    } else if (name === "preferences") {
      setPreferencesFilter(value);
    }
  };

  // Handle sort order change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div>
      <h2>Itineraries</h2>

      <div>
        <label>Sort by Price:</label>
        <select onChange={handleSortChange} value={sortOrder}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div>
        <label>Filter by Price:</label>
        <input
          type="number"
          name="priceMin"
          placeholder="Min Price"
          value={priceFilter.min}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="priceMax"
          placeholder="Max Price"
          value={priceFilter.max}
          onChange={handleFilterChange}
        />
      </div>

      <div>
        <label>Filter by Date:</label>
        <input
          type="text"
          name="date"
          placeholder="Enter a date (e.g. 2024-12-01)"
          value={dateFilter}
          onChange={handleFilterChange}
        />
      </div>

      <div>
        <label>Filter by Language:</label>
        <input
          type="text"
          name="language"
          placeholder="Enter language"
          value={languageFilter}
          onChange={handleFilterChange}
        />
      </div>

      <div>
        <label>Filter by Preferences (Activities):</label>
        <input
          type="text"
          name="preferences"
          placeholder="Enter preferences (e.g. hiking)"
          value={preferencesFilter}
          onChange={handleFilterChange}
        />
      </div>

      <h3>All Itineraries</h3>
      <ul>
        {filteredAndSortedItineraries.map((itinerary) => (
          <li key={itinerary._id}>
            <h4>{itinerary.name}</h4>
            <p>Activities: {itinerary.activities}</p>
            <p>Duration: {itinerary.duration}</p>
            <p>Locations: {itinerary.locationsToVisit.join(", ")}</p>
            <p>Price: ${itinerary.price}</p>
            <p>Available Dates: {itinerary.availableDates.join(", ")}</p>
            <p>Language: {itinerary.language}</p>
            <p>Booking Open: {itinerary.isBookingOpen ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItineraryPage2;
