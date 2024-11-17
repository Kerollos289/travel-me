//AdvertiserPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import GoogleMapReact from "google-map-react"; // For Google Maps

const AdvertiserPage = () => {
  const [activity, setActivity] = useState({
    activityName: "",
    date: "",
    time: "",
    location: "",
    price: 0,
    category: "",
    tags: "",
    specialDiscounts: false,
    isBookingOpen: true,
  });

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const [activities, setActivities] = useState([]); // List of activities
  const [editingActivityId, setEditingActivityId] = useState(null); // Track if we are editing an activity

  // Fetch all activities on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3500/api/activities"
        );
        setActivities(response.data.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActivity((prevActivity) => ({
      ...prevActivity,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingActivityId) {
        // If we are editing an existing activity
        response = await axios.put(
          `http://localhost:3500/api/activities/${editingActivityId}`,
          {
            ...activity,
            tags: activity.tags.split(",").map((tag) => tag.trim()), // Split tags by comma
          }
        );
        setActivities(
          activities.map((act) =>
            act._id === editingActivityId ? response.data.data : act
          )
        ); // Update the activity in the list
        alert("Activity updated successfully!");
      } else {
        // If we are creating a new activity
        response = await axios.post("http://localhost:3500/api/activities", {
          ...activity,
          tags: activity.tags.split(",").map((tag) => tag.trim()), // Split tags by comma
        });
        setActivities([...activities, response.data.data]); // Update local state with new activity

        alert("Activity created successfully!");

        // After creating the activity, add it to the user's activitiesArray
        const activityName = response.data.data.activityName; // Get the name of the created activity
        await axios.patch(
          `http://localhost:3500/api/travelJobsAccounts/${username}/addActivity`,
          { activityName } // Add the activity to the activitiesArray
        );
      }
      resetForm();
    } catch (error) {
      console.error("Error saving activity:", error);
      alert("Failed to save activity. Please try again.");
    }
  };

  // Reset the form
  const resetForm = () => {
    setActivity({
      activityName: "",
      date: "",
      time: "",
      location: "",
      price: 0,
      category: "",
      tags: "",
      specialDiscounts: false,
      isBookingOpen: true,
    });
    setEditingActivityId(null); // Reset editing state
  };

  // Delete an activity
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3500/api/activities/${id}`);
      setActivities(activities.filter((act) => act._id !== id)); // Remove deleted activity from local state
      alert("Activity deleted successfully!");
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Failed to delete activity. Please try again.");
    }
  };

  // Edit an activity
  const handleEdit = (act) => {
    setActivity({
      activityName: act.activityName,
      date: act.date,
      time: act.time,
      location: act.location,
      price: act.price,
      category: act.category,
      tags: act.tags.join(", "), // Convert array to comma-separated string
      specialDiscounts: act.specialDiscounts,
      isBookingOpen: act.isBookingOpen,
    });
    setEditingActivityId(act._id); // Set activity ID for editing
  };

  return (
    <div>
      <h2>{editingActivityId ? "Edit Activity" : "Create a New Activity"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Activity Name:</label>
          <input
            type="text"
            name="activityName"
            value={activity.activityName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={activity.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={activity.time}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={activity.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={activity.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={activity.category}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tags (comma separated):</label>
          <input
            type="text"
            name="tags"
            value={activity.tags}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            Special Discounts:
            <input
              type="checkbox"
              name="specialDiscounts"
              checked={activity.specialDiscounts}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Booking Open:
            <input
              type="checkbox"
              name="isBookingOpen"
              checked={activity.isBookingOpen}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">
          {editingActivityId ? "Update Activity" : "Create Activity"}
        </button>
      </form>

      {/* Google Map for decoration */}
      <div style={{ height: "400px", width: "100%", marginTop: "20px" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "YOUR_GOOGLE_MAPS_API_KEY" }} // Replace with your actual API key
          defaultCenter={{ lat: 59.95, lng: 30.33 }} // Default center of the map
          defaultZoom={11} // Default zoom level
        />
      </div>

      <h3>All Activities</h3>
      <ul>
        {activities.map((act) => (
          <li key={act._id}>
            {act.activityName}, {act.date}, {act.time}, {act.location}, $
            {act.price}, {act.category}, {act.tags.join(", ")},{" "}
            {act.specialDiscounts ? "Discounts Available" : "No Discounts"},{" "}
            {act.isBookingOpen ? "Open" : "Closed"}
            <button onClick={() => handleEdit(act)}>Edit</button>
            <button onClick={() => handleDelete(act._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdvertiserPage;
