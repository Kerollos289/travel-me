import React, { useState, useEffect } from "react";
// import "./tourGuidePage.css"; // Make sure your CSS file is correctly referenced

const AdvertiserProfile = () => {
  const [advertiser, setAdvertiser] = useState({
    username: "",
    email: "",
    website: "",
    hotline: "",
    companyProfile: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch logged-in user's profile from the backend
  useEffect(() => {
    const fetchAdvertiserProfile = async () => {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://localhost:3500/api/travelJobsAccounts/${username}`,
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
          setAdvertiser(data); // Populate the profile data
        } else {
          setMessage("Failed to fetch profile. Please try again later.");
        }
      } catch (error) {
        setMessage("An error occurred. Please check your connection.");
      }
    };

    fetchAdvertiserProfile();
  }, []);

  // Handle input changes when editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdvertiser({ ...advertiser, [name]: value });
  };

  // Submit profile updates to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3500/api/travelJobsAccounts/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hotline: advertiser.hotline,
            website: advertiser.website,
            companyProfile: advertiser.companyProfile,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");
        // setIsEditing(false); // Stop editing after successful update
      } else {
        setMessage("Failed to update profile. Please try again later.");
      }
    } catch (error) {
      setMessage("An error occurred. Please check your connection.");
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

  return (
    <div className="advertiser-page">
      <h1>Advertiser Profile</h1>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={advertiser.username}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={advertiser.email}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>hotline:</label>
          <input
            type="numbers"
            name="hotline"
            value={advertiser.hotline}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>website:</label>
          <input
            type="text"
            name="website"
            value={advertiser.website}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>company Profile:</label>
          <input
            type="text"
            name="companyProfile"
            value={advertiser.companyProfile}
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
    </div>
  );
};

export default AdvertiserProfile;
