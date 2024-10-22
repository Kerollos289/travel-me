import React, { useState, useEffect } from "react";

const AdminDeleteRequest = () => {
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch pending delete requests
  useEffect(() => {
    const fetchDeleteRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost:3500/api/deleteRequests",
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setDeleteRequests(data);
        } else {
          setMessage("Failed to fetch delete requests.");
        }
      } catch (error) {
        setMessage("An error occurred. Please check your connection.");
      }
    };

    fetchDeleteRequests();
  }, []);

  // Handle approve or reject delete request
  const handleAction = async (username, action) => {
    try {
      const response = await fetch(
        `http://localhost:3500/api/deleteRequest/${username}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(`Request for ${username} ${action}ed successfully.`);
        setDeleteRequests((prevRequests) =>
          prevRequests.filter((request) => request.username !== username)
        );
      } else {
        setMessage(data.message || `Failed to ${action} request.`);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="admin-delete-request">
      <h1>Account Deletion Requests</h1>
      {message && <p className="message">{message}</p>}
      <ul>
        {deleteRequests.map((request) => (
          <li key={request.username}>
            <span>{request.username}</span>
            <button
              onClick={() => handleAction(request.username, "approve")}
              className="btn"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(request.username, "reject")}
              className="btn"
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDeleteRequest;