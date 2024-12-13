import React, { useState, useEffect } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const Activities2 = () => {
  const [activities, setActivities] = useState([]); // Activities list state
  const [searchTerm, setSearchTerm] = useState(""); // Category search term state
  const [filteredActivities, setFilteredActivities] = useState([]); // Filtered activities
  const [minPrice, setMinPrice] = useState(""); // Minimum price filter
  const [maxPrice, setMaxPrice] = useState(""); // Maximum price filter
  const [startDate, setStartDate] = useState(""); // Start date filter
  const [endDate, setEndDate] = useState(""); // End date filter
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order: 'asc' or 'desc'
  const [currency, setCurrency] = useState("USD"); // Selected currency

  // Conversion rates
  const USD_TO_EGP = 50; // 1 USD = 50 EGP
  const USD_TO_EUR = 1 / 1.1; // 1 EUR = 1.1 USD

  // Fetch activities from backend
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get("http://localhost:3500/api/activities");
        setActivities(res.data.data);
        setFilteredActivities(res.data.data); // Initially show all activities
      } catch (err) {
        console.error("Error fetching activities:", err.message);
      }
    };
    fetchActivities();
  }, []);

  // Handle search and filter logic
  const handleSearch = () => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = activities.filter((activity) => {
      const matchesCategory = activity.category
        .toLowerCase()
        .includes(lowercasedSearchTerm);

      // Price filter logic
      const matchesPrice =
        (minPrice === "" || activity.price >= minPrice) &&
        (maxPrice === "" || activity.price <= maxPrice);

      // Date filter logic (similar to price filter)
      const matchesDate =
        (startDate === "" || new Date(activity.date) >= new Date(startDate)) &&
        (endDate === "" || new Date(activity.date) <= new Date(endDate));

      return matchesCategory && matchesPrice && matchesDate;
    });

    // Sort filtered activities by price based on sortOrder ('asc' or 'desc')
    const sortedActivities = filtered.sort((a, b) => {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });

    setFilteredActivities(sortedActivities);
  };

  // Update filtered activities whenever the search term or filter criteria change
  useEffect(() => {
    handleSearch();
  }, [
    searchTerm,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    sortOrder,
    activities,
  ]);

  // Helper function to convert prices based on selected currency
  const convertPrice = (price) => {
    switch (currency) {
      case "EGP":
        return `${Math.round(price * USD_TO_EGP)} EGP`;
      case "EUR":
        return `€${(price * USD_TO_EUR).toFixed(2)}`;
      default:
        return `$${price.toFixed(2)}`;
    }
  };

  return (
    <div>
      <h1>Activities</h1>

      {/* Currency Selection */}
      <div>
        <label>Select Currency: </label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EGP">EGP</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      {/* Search Bar for Category */}
      <div>
        <input
          type="text"
          placeholder="Search by category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Price Filter */}
      <div>
        <label>Min Price: </label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min Price"
        />
        <label>Max Price: </label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
        />
      </div>

      {/* Date Filter (like price filter) */}
      <div>
        <label>Start Date: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Sorting by Price */}
      <div>
        <label>Sort by Price: </label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* List of filtered activities */}
      <ul>
        {filteredActivities.map((activity) => (
          <li key={activity._id}>
            <h3>{activity.activityName}</h3>
            <p>Category: {activity.category}</p>
            <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
            <p>Time: {activity.time}</p>
            <p>Location: {activity.location || "Not specified"}</p>
            <p>Price: {convertPrice(activity.price)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Activities2;
