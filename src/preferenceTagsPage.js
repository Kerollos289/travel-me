import React, { useEffect, useState } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const PreferenceTagsPage = () => {
  const [preferenceTags, setPreferenceTags] = useState([]); // To hold preference tags from the API
  const [newTag, setNewTag] = useState(""); // To hold the input for a new preference tag
  const [editTag, setEditTag] = useState({ id: null, name: "" }); // To hold the tag being edited

  // Fetch the preference tags from the backend
  useEffect(() => {
    fetchPreferenceTags();
  }, []);

  const fetchPreferenceTags = async () => {
    try {
      const res = await axios.get("http://localhost:3500/api/preferenceTags"); // Ensure the correct API endpoint
      setPreferenceTags(res.data.data);
    } catch (err) {
      console.error("Error fetching preference tags:", err.message);
    }
  };

  // Handle creating a new preference tag
  const handleCreateTag = async () => {
    try {
      if (!newTag.trim()) {
        alert("Please enter a valid tag name"); // Alert for empty input
        return;
      }
      const response = await axios.post(
        "http://localhost:3500/api/preferenceTags",
        { name: newTag }
      );
      setPreferenceTags([...preferenceTags, response.data.data]); // Update the state with the new tag
      setNewTag(""); // Clear input field
    } catch (err) {
      console.error("Error creating preference tag:", err.message); // Log error message
    }
  };

  // Handle updating an existing tag
  const handleUpdateTag = async (id) => {
    try {
      if (!editTag.name.trim()) {
        alert("Tag name cannot be empty"); // Alert for empty input
        return;
      }
      const response = await axios.put(
        `http://localhost:3500/api/preferenceTags/${id}`,
        { name: editTag.name }
      );
      const updatedTags = preferenceTags.map((tag) =>
        tag._id === id ? response.data.data : tag
      );
      setPreferenceTags(updatedTags); // Update the state with the updated tag
      setEditTag({ id: null, name: "" }); // Clear edit state
    } catch (err) {
      console.error("Error updating preference tag:", err.message); // Log error message
    }
  };

  // Handle deleting a tag
  const handleDeleteTag = async (id) => {
    try {
      await axios.delete(`http://localhost:3500/api/preferenceTags/${id}`);
      setPreferenceTags(preferenceTags.filter((tag) => tag._id !== id)); // Remove the deleted tag from state
    } catch (err) {
      console.error("Error deleting preference tag:", err.message); // Log error message
    }
  };

  return (
    <div>
      <h1>Preference Tags</h1>

      {/* Create new preference tag */}
      <div>
        <input
          type="text"
          placeholder="New Preference Tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <button onClick={handleCreateTag}>Create Tag</button>
      </div>

      {/* List preference tags */}
      <ul>
        {preferenceTags.map((tag) => (
          <li key={tag._id}>
            {/* If editing, show an input field */}
            {editTag.id === tag._id ? (
              <input
                type="text"
                value={editTag.name}
                onChange={(e) =>
                  setEditTag({ id: tag._id, name: e.target.value })
                }
              />
            ) : (
              <span>{tag.name}</span>
            )}

            {/* Edit button */}
            {editTag.id === tag._id ? (
              <button onClick={() => handleUpdateTag(tag._id)}>Save</button>
            ) : (
              <button
                onClick={() => setEditTag({ id: tag._id, name: tag.name })}
              >
                Edit
              </button>
            )}

            {/* Delete button */}
            <button onClick={() => handleDeleteTag(tag._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PreferenceTagsPage;
