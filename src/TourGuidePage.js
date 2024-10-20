import React, { useState, useEffect } from "react";
import axios from "axios";

const TourGuidePage = () => {
  const [profile, setProfile] = useState({
    mobile: "",
    yearsOfExperience: "",
    previousWork: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch the profile data from the backend when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3500/api/travelJobsAccounts"
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Submit the updated profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:3500/api/travelJobsAccounts",
        profile
      );
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile.");
    }
  };

  return (
    <div>
      <h2>Tour Guide Profile</h2>
      {message && <p>{message}</p>}

      {!isEditing ? (
        <div>
          <p>Mobile: {profile.mobile}</p>
          <p>Years of Experience: {profile.yearsOfExperience}</p>
          <p>Previous Work: {profile.previousWork || "N/A"}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Mobile Number:</label>
            <input
              type="text"
              name="mobile"
              value={profile.mobile}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Years of Experience:</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={profile.yearsOfExperience}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Previous Work:</label>
            <input
              type="text"
              name="previousWork"
              value={profile.previousWork}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};

export default TourGuidePage;
