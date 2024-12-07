import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminViewAllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Filter by status
  const [sortOrder, setSortOrder] = useState("desc"); // Sort by date order

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3500/api/admin/complaints?status=${statusFilter}&sort=${sortOrder}`
      );
      setComplaints(response.data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, sortOrder]);

  const handleResolve = async (id) => {
    try {
      await axios.put(
        `http://localhost:3500/api/admin/complaints/${id}/resolve`
      );
      fetchComplaints();
    } catch (error) {
      console.error("Failed to resolve complaint:", error);
    }
  };

  const handleReply = async (id, reply) => {
    try {
      await axios.put(
        `http://localhost:3500/api/admin/complaints/${id}/reply`,
        { reply }
      );
      fetchComplaints();
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>All Complaints</h1>

      <div style={{ marginBottom: "20px" }}>
        {/* Filter Dropdown */}
        <label htmlFor="statusFilter">Filter by Status: </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* Sort Toggle */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          style={{ marginLeft: "20px", padding: "5px 10px" }}
        >
          Sort by Date: {sortOrder === "asc" ? "Oldest First" : "Newest First"}
        </button>
      </div>

      {complaints.map((complaint) => (
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
            <strong>From:</strong> {complaint.touristUsername}
          </p>
          <p>
            <strong>Status:</strong> {complaint.status}
          </p>
          <button
            onClick={() => handleResolve(complaint._id)}
            style={{ marginRight: "10px" }}
          >
            Mark as Resolved
          </button>
          <button onClick={() => alert(complaint.body)}>Expand</button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const reply = e.target.reply.value;
              handleReply(complaint._id, reply);
              e.target.reset();
            }}
            style={{ marginTop: "10px" }}
          >
            <input
              type="text"
              name="reply"
              placeholder="Type your reply"
              style={{ width: "70%", marginRight: "10px" }}
            />
            <button type="submit">Reply</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default AdminViewAllComplaints;
