import React, { useState, useEffect } from "react";
// import "./tourGuidePage.css"; // Make sure your CSS file is correctly referenced

const TourGuidePage = () => {
  const [tourGuide, setTourGuide] = useState({
    username: "",
    email: "",
    mobile: "",
    yearsOfExperience: "",
    previousWork: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch logged-in user's profile from the backend
  useEffect(() => {
    const fetchTourGuideProfile = async () => {
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
          setTourGuide(data); // Populate the profile data
        } else {
          setMessage("Failed to fetch profile. Please try again later.");
        }
      } catch (error) {
        setMessage("An error occurred. Please check your connection.");
      }
    };

    fetchTourGuideProfile();
  }, []);

  // Handle input changes when editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTourGuide({ ...tourGuide, [name]: value });
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
            mobile: tourGuide.mobile,
            yearsOfExperience: tourGuide.yearsOfExperience,
            previousWork: tourGuide.previousWork,
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
    <div className="tour-guide-page">
      <h1>Tour Guide Profile</h1>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={tourGuide.username}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={tourGuide.email}
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobile"
            value={tourGuide.mobile}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Years of Experience:</label>
          <input
            type="number"
            name="yearsOfExperience"
            value={tourGuide.yearsOfExperience}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Previous Work (if any):</label>
          <textarea
            name="previousWork"
            value={tourGuide.previousWork}
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

export default TourGuidePage;
