import React, { useState, useEffect } from "react";
// import "./tourGuidePage.css"; // Make sure your CSS file is correctly referenced

const TouristProfile = () => {
  const [tourist, setTourist] = useState({
    username: "",
    email: "",
    mobile_Number: "",
    nationality: "",
    DOB: "",
    job: "",
    wallet: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch logged-in user's profile from the backend
  useEffect(() => {
    const fetchTouristProfile = async () => {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://localhost:3500/api/touristsAccounts/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setTourist(data); // Populate the profile data
        } else {
          setMessage("Failed to fetch profile. Please try again later.");
        }
      } catch (error) {
        setMessage("An error occurred. Please check your connection.");
      }
    };

    fetchTouristProfile();
  }, []);

  // Handle input changes when editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTourist({ ...tourist, [name]: value });
  };

  // Submit profile updates to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3500/api/touristsAccounts/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mobile_Number: tourist.mobile_Number,
            nationality: tourist.nationality,
            job: tourist.job,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="tourist-profile-">
      <h1>Tourist Profile</h1>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={tourist.username}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={tourist.email}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>Wallet:</label>
          <input
            type="wallet"
            value={tourist.wallet}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            name="DOB"
            value={tourist.DOB}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobile_Number"
            value={tourist.mobile_Number}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Job:</label>
          <input
            type="text"
            name="job"
            value={tourist.job}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Nationality:</label>
          <textarea
            name="nationality"
            value={tourist.nationality}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        {isEditing ? (
          <button type="submit" className="btn">
            Save Changes
          </button>
        ) : (
          <button
            type="button"
            className="btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default TouristProfile;
