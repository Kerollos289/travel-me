import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristPreference = ({ username }) => {
  const [preferences, setPreferences] = useState([]);
  const [newPreference, setNewPreference] = useState("");

  useEffect(() => {
    // Fetch the preferences when the page loads
    const fetchPreferences = async () => {
      const storedUsername = localStorage.getItem("username"); // Retrieve username
      try {
        const response = await axios.get(
          `http://localhost:3500/api/tourist/preferences?username=${storedUsername}`
        );
        setPreferences(response.data.preferences); // Assuming backend sends an object with `preferences` key
      } catch (error) {
        console.error(
          "Error fetching preferences:",
          error.response?.data || error.message
        );
      }
    };

    fetchPreferences();
  }, [username]);

  const handleAddPreference = async () => {
    if (!newPreference) return; // Don't add empty preferences
    const storedUsername = localStorage.getItem("username"); // Retrieve username
    try {
      await axios.post("http://localhost:3500/api/tourist/preferences", {
        username: storedUsername,
        preference: newPreference,
      });
      setPreferences([...preferences, newPreference]); // Update UI
      setNewPreference(""); // Clear input field
    } catch (error) {
      console.error(
        "Error adding preference:",
        error.response?.data || error.message
      );
    }
  };

  const handleDeletePreference = async (index) => {
    const storedUsername = localStorage.getItem("username"); // Retrieve username
    try {
      await axios.delete(
        `http://localhost:3500/api/tourist/preferences/${index}?username=${storedUsername}`
      );
      const updatedPreferences = preferences.filter((_, i) => i !== index);
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error(
        "Error deleting preference:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <h1>Tourist Preferences</h1>
      <div>
        <input
          type="text"
          value={newPreference}
          onChange={(e) => setNewPreference(e.target.value)}
          placeholder="Enter new preference"
        />
        <button onClick={handleAddPreference}>Add Preference</button>
      </div>
      <ul>
        {preferences.map((pref, index) => (
          <li key={index}>
            {pref}
            <button onClick={() => handleDeletePreference(index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TouristPreference;
