import React, { useState } from "react";
import axios from "axios";
import "./activityCategoryPage.css";

const TouristFileComplaint = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const touristUsername = localStorage.getItem("username"); // Retrieve username from localStorage

    try {
      const response = await axios.post(
        "http://localhost:3500/api/tourist/file-complaint",
        {
          title,
          body,
          touristUsername,
        }
      );
      setMessage(response.data.message);
      setTitle("");
      setBody("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h1>File a Complaint</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          />
        </div>
        <div>
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
            rows="5"
          ></textarea>
        </div>
        <button type="submit" style={{ padding: "10px 20px" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default TouristFileComplaint;
