// ItineraryPage.js
// ItineraryPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const ItineraryPage = () => {
  const [itinerary, setItinerary] = useState({
    name: "",
    activities: "", // Now a simple string
    duration: "", // Added duration as a string
    locationsToVisit: "",
    timeline: "",
    price: 0,
    availableDates: "",
    accessibility: "",
    pickupLocation: "",
    dropOffLocation: "",
    language: "",
    isBookingOpen: false, // New field for booking status
  });

  const [itineraries, setItineraries] = useState([]); // List of itineraries
  const [editingItineraryId, setEditingItineraryId] = useState(null); // Track if we are editing an itinerary

  // Fetch all itineraries on component mount
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3500/api/itineraries/admin"
        );
        setItineraries(response.data); // Set state with fetched itineraries
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItinerary((prevItinerary) => ({
      ...prevItinerary,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission (create or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItineraryId) {
        // If we are editing an existing itinerary
        const response = await axios.put(
          `http://localhost:3500/api/itineraries/${editingItineraryId}`,
          {
            ...itinerary,
            activities: itinerary.activities, // Keep as a string
            locationsToVisit: itinerary.locationsToVisit
              .split(",")
              .map((location) => location.trim()), // Split locations by comma
            availableDates: itinerary.availableDates
              .split(",")
              .map((date) => date.trim()), // Split dates by comma
          }
        );
        setItineraries(
          itineraries.map((it) =>
            it._id === editingItineraryId ? response.data : it
          )
        ); // Update the itinerary in the list
        alert("Itinerary updated successfully!");
      } else {
        // If we are creating a new itinerary
        const username = localStorage.getItem("username");
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:3500/api/itineraries",
          {
            ...itinerary,
            locationsToVisit: itinerary.locationsToVisit
              .split(",")
              .map((location) => location.trim()), // Split locations by comma
            availableDates: itinerary.availableDates
              .split(",")
              .map((date) => date.trim()), // Split dates by comma
          }
        );
        setItineraries([...itineraries, response.data]); // Update local state with new itinerary
        await axios.patch(
          `http://localhost:3500/api/travelJobsAccounts/${username}/addItinerary`,
          { itineraryName: itinerary.name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert(`Itinerary created successfully!, ${itinerary.name}`);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving itinerary:", error);
      alert("Failed to save itinerary. Please try again.");
    }
  };

  // Reset the form
  const resetForm = () => {
    setItinerary({
      name: "",
      activities: "", // Reset activities
      duration: "", // Reset duration
      locationsToVisit: "",
      timeline: "",
      price: 0,
      availableDates: "",
      accessibility: "",
      pickupLocation: "",
      dropOffLocation: "",
      language: "",
      isBookingOpen: false, // Reset isBookingOpen
    });
    setEditingItineraryId(null); // Reset editing state
  };

  // Delete an itinerary
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3500/api/itineraries/${id}`);
      setItineraries(itineraries.filter((it) => it._id !== id)); // Remove deleted itinerary from local state
      alert("Itinerary deleted successfully!");
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      alert("Failed to delete itinerary. Please try again.");
    }
  };

  // Edit an itinerary
  const handleEdit = (it) => {
    setItinerary({
      name: it.name,
      activities: it.activities, // Keep as a string
      duration: it.duration, // Set duration as a string
      locationsToVisit: it.locationsToVisit.join(", "), // Convert array to comma-separated string
      timeline: it.timeline,
      price: it.price,
      availableDates: it.availableDates.join(", "), // Convert array to comma-separated string
      accessibility: it.accessibility,
      pickupLocation: it.pickupLocation,
      dropOffLocation: it.dropOffLocation,
      language: it.language,
      isBookingOpen: it.isBookingOpen, // Set booking status
    });
    setEditingItineraryId(it._id); // Set itinerary ID for editing
  };

  return (
    <div>
      <h2>
        {editingItineraryId ? "Edit Itinerary" : "Create a New Itinerary"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={itinerary.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Activities:</label>
          <input
            type="text"
            name="activities"
            value={itinerary.activities}
            onChange={handleChange}
            placeholder="Activities"
          />
        </div>
        <div>
          <label>Duration:</label>
          <input
            type="text"
            name="duration"
            value={itinerary.duration}
            onChange={handleChange}
            placeholder="Duration"
          />
        </div>
        <div>
          <label>Locations To Visit:</label>
          <input
            type="text"
            name="locationsToVisit"
            value={itinerary.locationsToVisit}
            onChange={handleChange}
            placeholder="Comma separated locations"
          />
        </div>
        <div>
          <label>Timeline:</label>
          <input
            type="text"
            name="timeline"
            value={itinerary.timeline}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={itinerary.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Available Dates:</label>
          <input
            type="text"
            name="availableDates"
            value={itinerary.availableDates}
            onChange={handleChange}
            placeholder="Comma separated dates"
          />
        </div>
        <div>
          <label>Accessibility:</label>
          <input
            type="text"
            name="accessibility"
            value={itinerary.accessibility}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Pickup Location:</label>
          <input
            type="text"
            name="pickupLocation"
            value={itinerary.pickupLocation}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Drop Off Location:</label>
          <input
            type="text"
            name="dropOffLocation"
            value={itinerary.dropOffLocation}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Language:</label>
          <input
            type="text"
            name="language"
            value={itinerary.language}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Booking Open:</label>
          <input
            type="checkbox"
            name="isBookingOpen"
            checked={itinerary.isBookingOpen}
            onChange={handleChange}
          />
        </div>
        <button type="submit">
          {editingItineraryId ? "Update Itinerary" : "Create Itinerary"}
        </button>
      </form>

      <h3>All Itineraries</h3>
      <ul>
        {itineraries.map((it) => (
          <li key={it._id}>
            {it.name}, Activities: {it.activities}, Duration: {it.duration},
            Locations: {it.locationsToVisit.join(", ")}, Price: ${it.price},
            Booking Open: {it.isBookingOpen ? "Yes" : "No"}
            <button onClick={() => handleEdit(it)}>Edit</button>
            <button onClick={() => handleDelete(it._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItineraryPage;
