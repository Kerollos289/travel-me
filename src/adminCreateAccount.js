import React, { useState } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const AdminCreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("admin");
  const [message, setMessage] = useState("");

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        " http://localhost:3500/createAccount",
        {
          username,
          password,
          accountType,
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message || "Error creating account");
    }
  };

  return (
    <div>
      <h2>Create Admin or Tourism Governor Account</h2>
      <form onSubmit={handleCreateAccount}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Account Type:
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="tourismGovernor">Tourism Governor</option>
          </select>
        </label>
        <button type="submit">Create Account</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminCreateAccount;
