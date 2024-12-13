import React, { useState, useEffect } from "react";
import "./activityCategoryPage.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3500/admin/documents")
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
        } else {
          setUsers(data); // Set users who have uploaded documents
        }
      })
      .catch((error) => console.error("Error fetching documents:", error));
  }, []);

  const handleAccept = async (username) => {
    try {
      const response = await fetch(
        "http://localhost:3500/api/updateUserStatus",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, accepted: true }),
        }
      );

      const data = await response.json();
      setMessage(data.message);

      // Refresh the list after accepting the user
      setUsers(users.filter((user) => user.username !== username));
    } catch (error) {
      setMessage("Error updating user status.");
    }
  };

  const handleReject = async (username) => {
    try {
      const response = await fetch(
        "http://localhost:3500/api/updateUserStatus",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, accepted: false }),
        }
      );

      const data = await response.json();
      setMessage(data.message);

      // Refresh the list after rejecting the user
      setUsers(users.filter((user) => user.username !== username));
    } catch (error) {
      setMessage("Error updating user status.");
    }
  };

  return (
    <div>
      <h1>Manage user document submissions below:</h1>
      {message && <p>{message}</p>}
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.username}>
              <p>Username: {user.username}</p>
              <p>Type: {user.type}</p>
              <p>
                Document:{" "}
                <a
                  href={`http://localhost:3500/${user.documentPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Document
                </a>
              </p>
              <button onClick={() => handleAccept(user.username)}>
                Accept
              </button>
              <button onClick={() => handleReject(user.username)}>
                Reject
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending users with documents.</p>
      )}
    </div>
  );
};

export default Admin;
