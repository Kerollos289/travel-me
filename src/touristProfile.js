//touristProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TouristProfile = () => {
  const [tourist, setTourist] = useState({
    username: "",
    email: "",
    mobile_Number: "",
    nationality: "",
    DOB: "",
    job: "",
    wallet: "",
    loyaltyPoints: "", // Add loyaltyPoints
    badge: "", // Add badge
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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
          setTourist(data); // Populate the profile data, including new fields
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

  const handleDeleteRequest = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3500/api/deleteRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Delete request submitted successfully!");
      } else {
        setMessage(data.message || "Failed to submit delete request.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

   // Handle converting loyalty points to wallet credit
   const handleConvertLoyaltyToWallet = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3500/api/convert-loyalty-to-wallet/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setTourist((prevState) => ({
          ...prevState,
          wallet: data.wallet,
          loyaltyPoints: data.loyaltyPoints,
        }));
        setMessage(data.message);
      } else {
        setMessage(data.message || "Failed to convert loyalty points.");
      }
    } catch (error) {
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="tourist-profile">
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
            type="text"
            value={tourist.wallet}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>Loyalty Points:</label>
          <input
            type="text"
            value={tourist.loyaltyPoints}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>Badge:</label>
          <input
            type="text"
            value={tourist.badgeLevel}
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

      <button onClick={handleDeleteRequest} className="btn">
        Request Account Deletion
      </button>
         {/* Convert loyalty points to wallet button */}
         <button
          type="button"
          className="btn"
          onClick={handleConvertLoyaltyToWallet}
        >
          Convert Loyalty Points to Wallet Credit
        </button>

      {/* New buttons for navigation */}
      <div className="navigation-buttons">
        <button
          className="btn"
          onClick={() => navigate("/available-bookings")}
        >
          View Available Bookings
        </button>
        <button className="btn" onClick={() => navigate("/my-bookings")}>
          View My Bookings
        </button>
      </div>
    </div>
  );
};

export default TouristProfile;
