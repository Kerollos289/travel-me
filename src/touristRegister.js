import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";

// Registration Component
const Registration = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    mobile_Number: "",
    nationality: "",
    DOB: "",
    job: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the date is in the correct format (yyyy-mm-dd)
    const formattedDOB = new Date(formData.DOB).toISOString().split("T")[0]; // Extract yyyy-mm-dd

    // Calculate age to ensure the user is at least 18
    const age = calculateAge(formData.DOB);
    if (age < 18) {
      setErrorMessage("You must be at least 18 years old to register.");
      return;
    }

    setErrorMessage(""); // Clear any previous error messages

    // Prepare the data to send, including the correctly formatted DOB
    const finalFormData = {
      ...formData,
      DOB: formattedDOB, // Replace the DOB with the correctly formatted one
    };

    try {
      const response = await fetch(
        "http://localhost:3500/api/touristsAccounts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalFormData), // Send the corrected formData
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Notify the user of successful registration
        navigate("/login"); // Redirect to login page
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message); // Display the error (duplicate username/email, etc.)
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred during registration.");
    }
  };

  return (
    <div className="form-container">
      <h1>Tourist Registration</h1>
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
        <input
          type="text"
          name="mobile_Number"
          placeholder="Mobile Number"
          value={formData.mobile_Number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nationality"
          placeholder="Nationality"
          value={formData.nationality}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="DOB"
          value={formData.DOB}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="job"
          placeholder="Job"
          value={formData.job}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

// Login Component (Dummy Example)
const Login = () => {
  return (
    <div className="form-container">
      <h1>Login</h1>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/">Register here</Link>
      </p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
