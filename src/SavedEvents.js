
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const SavedEvents = () => {
  const [savedMuseums, setSavedMuseums] = useState([]);

  // Load saved museums from localStorage
  useEffect(() => {
    const savedMuseumsData = JSON.parse(localStorage.getItem("savedMuseums")) || [];
    setSavedMuseums(savedMuseumsData);
  }, []);

  return (
    <div>
      <h2>Saved Museums</h2>
      {savedMuseums.length === 0 ? (
        <p>No saved museums!</p>
      ) : (
        <ul>
          {savedMuseums.map((museum) => (
            <li key={museum._id}>
              <h3>{museum.name}</h3>
              <p>{museum.location}</p>
              <p>{museum.description}</p>
              <li>Foreigner: ${museum.foreignerTicketPrice}</li>
              <li>Student: ${museum.studentTicketPrice}</li>
              <li>Native: ${museum.nativeTicketPrice}</li>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedEvents;
