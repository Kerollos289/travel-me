//login.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:3500/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Use window.location.href instead of navigate for redirection
        localStorage.setItem("username", username);
        localStorage.setItem("token", data.token);
        window.location.href = data.redirect;
      } else {
        setError(data.message); // Set error if login fails
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn">
          Login
        </button>
      </form>
      <Link to="/change-password">
        <button className="role-btn">Change password</button>
      </Link>
      <Link to="/forget-password">
        <button className="role-btn">Forget Password</button>
      </Link>
    </div>
  );
};

export default LoginPage;
