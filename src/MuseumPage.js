//MuseumPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const MuseumPage = () => {
  const [museum, setMuseum] = useState({
    name: "",
    description: "",
    pictures: [],
    location: "",
    openingHours: "",
    foreignerTicketPrice: 0,
    studentTicketPrice: 0,
    nativeTicketPrice: 0,
  });

  const [museums, setMuseums] = useState([]);
  const [editingMuseumId, setEditingMuseumId] = useState(null);

  // Fetch all museums on component mount
  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/museums");
        setMuseums(response.data);
      } catch (error) {
        console.error("Error fetching museums:", error);
      }
    };

    fetchMuseums();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMuseum((prevMuseum) => ({
      ...prevMuseum,
      [name]: value,
    }));
  };

  // Handle form submission (create or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMuseumId) {
        const response = await axios.put(`http://localhost:3500/api/museums/${editingMuseumId}`, {
          ...museum,
          pictures: museum.pictures.split(",").map((pic) => pic.trim()),
        });
        setMuseums(museums.map((mus) => (mus._id === editingMuseumId ? response.data : mus)));
        alert("Museum updated successfully!");
      } else {
        const response = await axios.post("http://localhost:3500/api/museums", {
          ...museum,
          pictures: museum.pictures.split(",").map((pic) => pic.trim()),
        });
        setMuseums([...museums, response.data]);
        alert("Museum created successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving museum:", error);
      alert("Failed to save museum. Please try again.");
    }
  };

  // Reset the form
  const resetForm = () => {
    setMuseum({
      name: "",
      description: "",
      pictures: [],
      location: "",
      openingHours: "",
      foreignerTicketPrice: 0,
      studentTicketPrice: 0,
      nativeTicketPrice: 0,
    });
    setEditingMuseumId(null);
  };

  // Delete a museum
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3500/api/museums/${id}`);
      setMuseums(museums.filter((mus) => mus._id !== id));
      alert("Museum deleted successfully!");
    } catch (error) {
      console.error("Error deleting museum:", error);
      alert("Failed to delete museum. Please try again.");
    }
  };

  // Edit a museum
  const handleEdit = (mus) => {
    setMuseum({
      name: mus.name,
      description: mus.description,
      pictures: mus.pictures.join(", "),
      location: mus.location,
      openingHours: mus.openingHours,
      foreignerTicketPrice: mus.foreignerTicketPrice,
      studentTicketPrice: mus.studentTicketPrice,
      nativeTicketPrice: mus.nativeTicketPrice,
    });
    setEditingMuseumId(mus._id);
  };

  return (
    <div>
      <h2>{editingMuseumId ? "Edit Museum" : "Create a New Museum"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={museum.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={museum.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Pictures (comma separated URLs):</label>
          <input
            type="text"
            name="pictures"
            value={museum.pictures}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={museum.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Opening Hours:</label>
          <input
            type="text"
            name="openingHours"
            value={museum.openingHours}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Foreigner Ticket Price:</label>
          <input
            type="number"
            name="foreignerTicketPrice"
            value={museum.foreignerTicketPrice}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Student Ticket Price:</label>
          <input
            type="number"
            name="studentTicketPrice"
            value={museum.studentTicketPrice}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Native Ticket Price:</label>
          <input
            type="number"
            name="nativeTicketPrice"
            value={museum.nativeTicketPrice}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editingMuseumId ? "Update Museum" : "Create Museum"}</button>
      </form>

      <h3>All Museums</h3>
      <ul>
        {museums.map((mus) => (
          <li key={mus._id}>
            {mus.name}, {mus.description}, {mus.location}, {mus.openingHours}, Foreigner Price: ${mus.foreignerTicketPrice}, Student Price: ${mus.studentTicketPrice}, Native Price: ${mus.nativeTicketPrice}
            <button onClick={() => handleEdit(mus)}>Edit</button>
            <button onClick={() => handleDelete(mus._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MuseumPage;