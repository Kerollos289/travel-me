// SalesPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [report, setReport] = useState({ totalRevenue: 0, totalAppRate: 0 });

  useEffect(() => {
    // Fetch all sales and the report data from the backend
    const fetchSalesData = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/sales");
        setSales(response.data);
      } catch (error) {
        console.error("Error fetching sales data", error);
      }
    };

    const fetchSalesReport = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/sales/report");
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching sales report", error);
      }
    };

    fetchSalesData();
    fetchSalesReport();
  }, []);

  return (
    <div>
      <h1>Sales Entries</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Revenue</th>
            <th>App Rate (10%)</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale._id}>
              <td>{sale.name}</td>
              <td>{sale.type}</td>
              <td>${sale.revenue.toFixed(2)}</td>
              <td>${sale.appRate.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default SalesReport;