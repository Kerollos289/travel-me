import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
import "./App.css"; // Ensure your CSS file is imported for styling

const TravelJobsRegister = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    type: "", // Job type field
  });

  const [errorMessage, setErrorMessage] = useState("");
  //const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send
    try {
      const response = await fetch(
        "http://localhost:3500/api/travelJobsAccounts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // navigate("/login"); // Redirect to login page after successful registration
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred during registration.");
    }
  };

  return (
    <div className="form-container">
      <h1>Travel Job Registration</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select your job
          </option>
          <option value="tour guide">Tour Guide</option>
          <option value="advertiser">Advertiser</option>
          <option value="seller">Seller</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {/* <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p> */}
    </div>
  );
};

export default TravelJobsRegister;