import React, { useState, useEffect } from "react";
import axios from "axios";

const Museums2 = () => {
  const [museums, setMuseums] = useState([]);
  const [filteredMuseums, setFilteredMuseums] = useState([]);
  const [historicalPeriod, setHistoricalPeriod] = useState("");
  const [locationType, setLocationType] = useState("");
  const [currency, setCurrency] = useState("USD"); // Selected currency

  // Conversion rates
  const USD_TO_EGP = 50; // Example: 1 USD = 50 EGP
  const USD_TO_EUR = 1 / 1.1; // Example: 1 EUR = 1.1 USD

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

  // Helper function to convert prices based on selected currency
  const convertPrice = (price) => {
    switch (currency) {
      case "EGP":
        return `${Math.round(price * USD_TO_EGP)} EGP`;
      case "EUR":
        return `€${(price * USD_TO_EUR).toFixed(2)}`;
      default:
        return `$${price.toFixed(2)}`;
    }
  };

  return (
    <div>
      <h2>All Museums</h2>

      {/* Currency Selection */}
      <div>
        <label>Select Currency: </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EGP">EGP</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      {/* Filters */}
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

      {/* Museum List */}
      <ul>
        {filteredMuseums.map((mus) => (
          <li key={mus._id}>
            <strong>{mus.name}</strong> - {mus.description} <br />
            Location: {mus.location} <br />
            Opening Hours: {mus.openingHours} <br />
            Foreigner Price: {convertPrice(mus.foreignerTicketPrice)}, 
            Student Price: {convertPrice(mus.studentTicketPrice)}, 
            Native Price: {convertPrice(mus.nativeTicketPrice)} <br />
            Historical Period: {mus.historicalPeriod || "N/A"} <br />
            Location Type: {mus.locationType} <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Museums2;
