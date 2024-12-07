import React, { useEffect, useState } from "react";
import axios from "axios";

const TouristViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const touristUsername = localStorage.getItem("username"); // Fetch tourist's username from localStorage

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3500/api/tourist/complaints?touristUsername=${touristUsername}`
      );
      setComplaints(response.data);
    } catch (error) {
      setMessage("Failed to fetch complaints.");
    }
  };

  useEffect(() => {
    if (touristUsername) {
      fetchComplaints();
    }
  }, [touristUsername]);

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>Your Complaints</h1>

      {message && <p>{message}</p>}

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        complaints.map((complaint) => (
          <div
            key={complaint._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{complaint.title}</h3>
            <p>
              <strong>Status:</strong> {complaint.status}
            </p>
            <p>
              <strong>Reply from Admin:</strong>{" "}
              {complaint.reply || "No reply yet."}
            </p>
            <p>
              <strong>Complaint Body:</strong> {complaint.body}
            </p>
            <p>
              <strong>Submitted on:</strong>{" "}
              {new Date(complaint.date).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default TouristViewComplaints;
