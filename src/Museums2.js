// Museums2.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Museums2 = () => {
  const [museums, setMuseums] = useState([]);
  const [filteredMuseums, setFilteredMuseums] = useState([]);
  const [historicalPeriod, setHistoricalPeriod] = useState("");
  const [locationType, setLocationType] = useState("");

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/museums");
        setMuseums(response.data);
        setFilteredMuseums(response.data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching museums:", error);
      }
    };
    fetchMuseums();
  }, []);

  const handleFilter = () => {
    setFilteredMuseums(
      museums.filter((museum) => 
        (!historicalPeriod || museum.historicalPeriod === historicalPeriod) &&
        (!locationType || museum.locationType === locationType)
      )
    );
  };

  return (
    <div>
      <h2>All Museums</h2>
      <div>
        <label>Filter by Historical Period:</label>
        <input
          type="text"
          value={historicalPeriod}
          onChange={(e) => setHistoricalPeriod(e.target.value)}
          placeholder="e.g., Renaissance"
        />
      </div>
      <div>
        <label>Filter by Location Type:</label>
        <select
          value={locationType}
          onChange={(e) => setLocationType(e.target.value)}
        >
          <option value="">Select Location Type</option>
          <option value="Monuments">Monuments</option>
          <option value="Museums">Museums</option>
          <option value="Religious Sites">Religious Sites</option>
          <option value="Palaces/Castles">Palaces/Castles</option>
        </select>
      </div>
      <button onClick={handleFilter}>Apply Filters</button>

      <ul>
        {filteredMuseums.map((mus) => (
          <li key={mus._id}>
            <strong>{mus.name}</strong> - {mus.description} <br />
            Location: {mus.location} <br />
            Opening Hours: {mus.openingHours} <br />
            Foreigner Price: ${mus.foreignerTicketPrice}, Student Price: ${mus.studentTicketPrice}, Native Price: ${mus.nativeTicketPrice} <br />
            Historical Period: {mus.historicalPeriod || "N/A"} <br />
            Location Type: {mus.locationType} <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Museums2;
