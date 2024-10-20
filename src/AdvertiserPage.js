import React, { useState, useEffect } from "react"; 
import GoogleMapReact from 'google-map-react'; // For Google Maps
import axios from "axios"; // Import axios for API requests




const AdvertiserPage = () => {
  const [activity, setActivity] = useState({
    date: "",
    time: "",
    location: { lat: 0, lng: 0 },
    price: "",
    category: "",
    tags: [],
    discounts: false,
    bookingOpen: false,
  });

  const [activities, setActivities] = useState([]); // List of activities
  const [editingActivityId, setEditingActivityId] = useState(null); // For editing activities

  // Fetch all activities on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/activities");
        setActivities(response.data.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setActivity({ ...activity, [name]: value });
  };

  // Handle map location change (Google Maps API)
  const handleMapChange = ({ lat, lng }) => {
    setActivity({ ...activity, location: { lat, lng } });
  };

  // Create a new activity
  const handleCreateActivity = async () => {
    try {
      const response = await axios.post("http://localhost:3500/api/activities", {
        ...activity,
        tags: activity.tags.split(",").map(tag => tag.trim()), // Split tags by comma
      });
      setActivities([...activities, response.data.data]); // Update local state with new activity
      resetForm();
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  // Update an existing activity
  const handleUpdateActivity = async () => {
    try {
      const response = await axios.put(`http://localhost:3500/api/activities/${editingActivityId}`, {
        ...activity,
        tags: activity.tags.split(",").map(tag => tag.trim()), // Split tags by comma
      });
      setActivities(activities.map(act => (act._id === editingActivityId ? response.data.data : act))); // Update local state with updated activity
      resetForm();
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  // Delete an activity
  const handleDeleteActivity = async (id) => {
    try {
      await axios.delete(`http://localhost:3500/api/activities/${id}`);
      setActivities(activities.filter(act => act._id !== id)); // Remove activity from state
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  // Reset the form
  const resetForm = () => {
    setActivity({
      date: "",
      time: "",
      location: { lat: 0, lng: 0 },
      price: "",
      category: "",
      tags: "",
      discounts: false,
      bookingOpen: false,
    });
    setEditingActivityId(null); // Reset editing state
  };

  // Start editing an activity
  const startEditingActivity = (act) => {
    setActivity({
      date: act.date,
      time: act.time,
      location: act.location,
      price: act.price,
      category: act.category,
      tags: act.tags.join(", "), // Convert array to comma-separated string
      discounts: act.discounts,
      bookingOpen: act.bookingOpen,
    });
    setEditingActivityId(act._id); // Set activity ID for editing
  };

  return (
    <div className="advertiser-page">
      <h2>Advertiser Dashboard - {editingActivityId ? "Edit" : "Create"} an Activity</h2>
      
      <form className="activity-form" onSubmit={e => e.preventDefault()}>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={activity.date}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Time:
          <input
            type="time"
            name="time"
            value={activity.time}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Price (or Price Range):
          <input
            type="text"
            name="price"
            value={activity.price}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={activity.category}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Tags (comma separated):
          <input
            type="text"
            name="tags"
            value={activity.tags}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Special Discounts:
          <input
            type="checkbox"
            name="discounts"
            checked={activity.discounts}
            onChange={() =>
              setActivity({ ...activity, discounts: !activity.discounts })
            }
          />
        </label>
        <label>
          Booking Open:
          <input
            type="checkbox"
            name="bookingOpen"
            checked={activity.bookingOpen}
            onChange={() =>
              setActivity({ ...activity, bookingOpen: !activity.bookingOpen })
            }
          />
        </label>

        <div style={{ height: '400px', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'YOUR_GOOGLE_MAPS_API_KEY' }}
            defaultCenter={{ lat: 59.95, lng: 30.33 }}
            defaultZoom={11}
            onClick={({ lat, lng }) => handleMapChange({ lat, lng })}
          />
        </div>

        <button type="button" onClick={editingActivityId ? handleUpdateActivity : handleCreateActivity}>
          {editingActivityId ? "Update Activity" : "Create Activity"}
        </button>
        <button type="button" onClick={resetForm}>
          Cancel
        </button>
      </form>

      <h3>All Activities</h3>
      <ul>
        {activities.map((act) => (
          <li key={act._id}>
            {act.date}, {act.time}, {act.location.lat}, {act.location.lng}, {act.price}, {act.category}, {act.tags.join(", ")}, {act.discounts ? "Discounts Available" : "No Discounts"}, {act.bookingOpen ? "Open" : "Closed"}
            <button onClick={() => startEditingActivity(act)}>Edit</button>
            <button onClick={() => handleDeleteActivity(act._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdvertiserPage;
