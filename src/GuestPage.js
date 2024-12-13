//GuestPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const GuestPage = () => {
  const [guestSales, setGuestSales] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  // Fetch guest sales data based on search and filter
  const fetchGuestSalesData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3500/api/guest-sales",
        {
          params: {
            name: searchName, // Search by name
            month: filterMonth, // Filter by month
          },
        }
      );
      setGuestSales(response.data);
    } catch (error) {
      console.error("Error fetching guest sales data", error);
    }
  };

  useEffect(() => {
    fetchGuestSalesData();
  }, [searchName, filterMonth]); // Refetch when searchName or filterMonth changes

  return (
    <div>
      <h1>My Sales Entries</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />

      {/* Month Filter */}
      <select
        value={filterMonth}
        onChange={(e) => setFilterMonth(e.target.value)}
      >
        <option value="">All Months</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <option key={month} value={month}>
            {new Date(0, month - 1).toLocaleString("default", {
              month: "long",
            })}
          </option>
        ))}
      </select>

      {/* Display Guest Sales */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name of Sale</th>
            <th>Revenue</th>
            <th>My Rate (90%)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {guestSales.map((guestSale) => (
            <tr key={guestSale._id}>
              <td>{guestSale.name}</td>
              <td>${guestSale.revenue.toFixed(2)}</td>
              <td>${(guestSale.revenue * 0.9).toFixed(2)}</td>
              <td>{new Date(guestSale.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuestPage;
