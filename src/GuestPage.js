//GuestPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const GuestPage = () => {
  const [guestSales, setGuestSales] = useState([]);
  const [report, setReport] = useState({ totalRevenue: 0, totalMyRate: 0 });

  useEffect(() => {
    // Fetch all guest sales and the report data from the backend
    const fetchGuestSalesData = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/guest-sales");
        setGuestSales(response.data);
      } catch (error) {
        console.error("Error fetching guest sales data", error);
      }
    };


    fetchGuestSalesData();
  }, []);

  return (
    <div>
      <h1>Guest Sales Entries</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name of Guest Sale</th>
            <th>Revenue</th>
            <th>My Rate (90%)</th>
          </tr>
        </thead>
        <tbody>
          {guestSales.map((guestSale) => (
            <tr key={guestSale._id}>
              <td>{guestSale.name}</td>
              <td>${guestSale.revenue.toFixed(2)}</td>
              <td>${(guestSale.revenue * 0.9).toFixed(2)}</td> {/* Assuming myRate is revenue * 0.9 */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuestPage;