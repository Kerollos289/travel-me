//notAccepted.js
import React, { useState, useEffect } from "react";
import "./notAccepted.css";

const NotAccepted = () => {
  const [username, setUsername] = useState("");
  const [document, setDocument] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Retrieve the logged-in user's username from local storage or session
    const loggedInUser = localStorage.getItem("username");
    if (loggedInUser) {
      setUsername(loggedInUser);
    }
  }, []);

  const handleDocumentUpload = async (e) => {
    e.preventDefault();
    if (!document) {
      setMessage("Please upload a document.");
      return;
    }

    const formData = new FormData();
    formData.append("document", document);
    formData.append("username", username); // Include username in form data

    try {
      const response = await fetch("http://localhost:3500/api/uploadDocument", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Document uploaded successfully!");
      } else {
        setMessage(data.message || "Failed to upload document.");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="not-accepted-page">
      <h1>Welcome, {username}</h1>
      <p>
        Your account is not yet accepted. Please upload your documents below.
      </p>
      <form onSubmit={handleDocumentUpload} encType="multipart/form-data">
        <input
          type="file"
          onChange={(e) => setDocument(e.target.files[0])}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <button type="submit">Upload Document</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default NotAccepted;
