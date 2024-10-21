import React, { useState, useEffect } from "react";
// import "./tourGuidePage.css"; // Make sure your CSS file is correctly referenced

const SellerPage = () => {
  const [seller, setSeller] = useState({
    username: "",
    email: "",
    name: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch logged-in user's profile from the backend
  useEffect(() => {
    const fetchSellerProfile = async () => {
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
          setSeller(data); // Populate the profile data
        } else {
          setMessage("Failed to fetch profile. Please try again later.");
        }
      } catch (error) {
        setMessage("An error occurred. Please check your connection.");
      }
    };

    fetchSellerProfile();
  }, []);

  // Handle input changes when editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSeller({ ...seller, [name]: value });
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
            name: seller.name,
            description: seller.description,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");
        //setIsEditing(false); // Stop editing after successful update
      } else {
        setMessage("Failed to update profile. Please try again later.");
      }
    } catch (error) {
      setMessage("An error occurred. Please check your connection.");
    }
  };

  return (
    <div className="seller-page">
      <h1>Seller Profile</h1>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={seller.username}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={seller.email}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={seller.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={seller.description}
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

export default SellerPage;
