import React, { useEffect, useState } from "react";

const TourGuideReport = ({ TourGuideId }) => {
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username"); // Check if 'username' exists in localStorage
  console.log("Username:", username);
  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Ensure the URL is correctly constructed
        const response = await fetch(
          `http://localhost:3500/api/travelJobsAccounts/tourGuideReport/${username}`
        );

        if (response.ok) {
          const data = await response.json();
          setReport(data);
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
  }, [TourGuideId, username]); // Ensure username is used in dependency array
  return (
    <div>
      <h1>Itinerary Report</h1>
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
    </div>
  );
};

export default TourGuideReport;