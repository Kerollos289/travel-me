import React, { useState } from "react";
import "./activityCategoryPage.css";

const AdminDelete = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3500/api/adminDelete/${username}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(`Account with username "${username}" has been deleted.`);
      } else {
        setMessage(data.message || "Failed to delete the account.");
      }
    } catch (error) {
      setMessage("An error occurred. Please check your connection.");
    }
  };

  return (
    <div className="admin-delete-page">
      <h1>Delete an Account</h1>
      {message && <p>{message}</p>}

      <form onSubmit={handleDelete}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn">
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default AdminDelete;
