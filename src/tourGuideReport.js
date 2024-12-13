import React, { useEffect, useState } from "react";
import "./activityCategoryPage.css";

const TourGuideReport = ({ TourGuideId }) => {
  const [report, setReport] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // For filtering by month
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const query = selectedMonth ? `?month=${selectedMonth}` : "";
        const response = await fetch(
          `http://localhost:3500/api/travelJobsAccounts/tourGuideReport/${username}${query}`
        );

        if (response.ok) {
          const data = await response.json();

          // Calculate the total count of tourists
          const totalCount = Object.values(data).reduce(
            (sum, count) => (count === "Deleted" ? sum : sum + count),
            0
          );

          setReport(data);
          setTotal(totalCount);
        } else {
          throw new Error("Failed to fetch report");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchReport();
    } else {
      setError("Username not found in localStorage");
      setLoading(false);
    }
  }, [TourGuideId, username, selectedMonth]); // Re-fetch when selectedMonth changes

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Itinerary Report</h1>
      <label htmlFor="month-filter">Filter by Month:</label>
      <select
        id="month-filter"
        value={selectedMonth}
        onChange={handleMonthChange}
      >
        <option value="">All Months</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Itinerary Name</th>
            <th>Tourists Registered</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(report).map(([itinerary, count]) => (
            <tr key={itinerary}>
              <td>{itinerary}</td>
              <td>{count === "Deleted" ? "Deleted" : count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Total Tourists Registered: {total}</h2>
    </div>
  );
};

export default TourGuideReport;
