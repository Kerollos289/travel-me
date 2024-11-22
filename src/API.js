export const fetchAccessToken = async () => {
  const response = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: "AAiWz7Mf9vizArpDhAJ8rw4txwrnnGMJ",
        client_secret: "Us4kw1Gv7SuSE9VA",
        grant_type: "client_credentials",
      }),
    }
  );

  const data = await response.json();
  return data.access_token;
};

export const searchFlights = async ({
  token,
  origin,
  destination,
  departureDate,
  returnDate,
  adults = 1,
  children,
  infants,
  travelClass,
  nonStop = false,
  maxPrice,
  max = 250,
}) => {
  // Construct the base URL with required parameters
  let url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}&nonStop=${nonStop}&max=${max}`;

  // Append optional parameters if provided
  if (returnDate) url += `&returnDate=${returnDate}`;
  if (children) url += `&children=${children}`;
  if (infants) url += `&infants=${infants}`;
  if (travelClass) url += `&travelClass=${travelClass}`;
  if (maxPrice) url += `&maxPrice=${maxPrice}`;

  console.log(url);
  console.log(travelClass);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch flight offers");

  const data = await response.json();
  return data.data; // Adjust this based on Amadeus API response structure
};

// export const bookFlight = async (token, flightId, passengerName) => {
//   const response = await fetch(
//     `https://test.api.amadeus.com/v2/booking/flights/${flightId}/book`,
//     {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         passengerName,
//       }),
//     }
//   );

//   const data = await response.json();
//   return data;  // Adjust based on booking API response
// };
