import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristBookItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [bookedItineraries, setBookedItineraries] = useState([]);
  const [attendedItineraries, setAttendedItineraries] = useState(
    JSON.parse(localStorage.getItem("attendedItineraries")) || [] // Load from localStorage
  );
  const [ratings, setRatings] = useState(
    JSON.parse(localStorage.getItem("itineraryRatings")) || {} // Load from localStorage
  );
  const [comments, setComments] = useState(
    JSON.parse(localStorage.getItem("itineraryComments")) || {} // Load from localStorage
  );
  const [bookmarkedItineraries, setBookmarkedItineraries] = useState(
    JSON.parse(localStorage.getItem("bookmarkedItineraries")) || [] // Load from localStorage
  );
  const username = localStorage.getItem("username"); // Tourist's username from localStorage

  // Fetch itineraries and the tourist's booked itineraries on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all itineraries
        const itinerariesResponse = await axios.get(
          "http://localhost:3500/api/itineraries"
        );
        const allItineraries = itinerariesResponse.data;

        // Fetch the tourist's account details to get booked itineraries
        const touristResponse = await axios.get(
          `http://localhost:3500/api/touristsAccounts/${username}`
        );
        const { bookedItineraries } = touristResponse.data;

        // Filter out already booked itineraries
        const availableItineraries = allItineraries.filter(
          (itinerary) => !bookedItineraries.includes(itinerary.name)
        );

        setItineraries(availableItineraries);
        setBookedItineraries(bookedItineraries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  // Function to handle booking an itinerary
  const handleBooking = async (itineraryName) => {
    try {
      // Send a PATCH request to book the itinerary
      const response = await axios.patch(
        "http://localhost:3500/api/touristsAccounts/bookItinerary",
        {
          username: username,
          itineraryName: itineraryName,
        }
      );

      if (response.status === 200) {
        // Update the UI after booking
        setBookedItineraries((prev) => [...prev, itineraryName]);
        setItineraries((prev) =>
          prev.filter((itinerary) => itinerary.name !== itineraryName)
        );
        alert("Itinerary booked successfully!");
      } else {
        alert("Failed to book itinerary.");
      }
    } catch (error) {
      console.error("Error booking itinerary:", error);
    }
  };

  // Function to mark an itinerary as attended
  const handleAttendItinerary = (itineraryName) => {
    const updatedAttendedItineraries = [...attendedItineraries, itineraryName];
    setAttendedItineraries(updatedAttendedItineraries);
    localStorage.setItem("attendedItineraries", JSON.stringify(updatedAttendedItineraries)); // Save to localStorage
  };

  // Handle rating an itinerary
  const handleRateItinerary = (itineraryName, rating) => {
    const updatedRatings = { ...ratings, [itineraryName]: rating };
    setRatings(updatedRatings);
    localStorage.setItem("itineraryRatings", JSON.stringify(updatedRatings)); // Save to localStorage
  };

  // Handle leaving a comment for an itinerary
  const handleCommentChange = (itineraryName, comment) => {
    const updatedComments = { ...comments, [itineraryName]: comment };
    setComments(updatedComments);
    localStorage.setItem("itineraryComments", JSON.stringify(updatedComments)); // Save to localStorage
  };

  // Handle bookmarking an itinerary
  const handleBookmarkItinerary = (itineraryName) => {
    const updatedBookmarkedItineraries = [...bookmarkedItineraries, itineraryName];
    setBookmarkedItineraries(updatedBookmarkedItineraries);
    localStorage.setItem("bookmarkedItineraries", JSON.stringify(updatedBookmarkedItineraries)); // Save to localStorage
  };

  // Function to remove a bookmark
  const handleRemoveBookmark = (itineraryName) => {
    const updatedBookmarkedItineraries = bookmarkedItineraries.filter(
      (name) => name !== itineraryName
    );
    setBookmarkedItineraries(updatedBookmarkedItineraries);
    localStorage.setItem("bookmarkedItineraries", JSON.stringify(updatedBookmarkedItineraries)); // Save to localStorage
  };

  // Function to share itinerary via link or email
  const handleShareItinerary = (itineraryName) => {
    const itineraryUrl = `http://localhost:4200/itinerary/${itineraryName}`;
    alert(`You can share this itinerary via link: ${itineraryUrl}`);
  };

  // Function to share via mail
  const handleShareViaMail = (itineraryName) => {
    const itineraryUrl = `http://localhost:4200/itinerary/${itineraryName}`;
    const subject = `Check out this amazing itinerary: ${itineraryName}`;
    const body = `I found this great itinerary and thought you would be interested in it!\n\nItinerary: ${itineraryName}\nLink: ${itineraryUrl}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Trigger the mail client
    window.location.href = mailtoLink;
  };

  return (
    <div>
      <h1>Available Itineraries</h1>
      {itineraries.length === 0 ? (
        <p>No itineraries available to book!</p>
      ) : (
        <ul>
          {itineraries.map((itinerary) => (
            <li key={itinerary._id}>
              <h3>{itinerary.name}</h3>
              <p>{itinerary.activities}</p>
              <p><strong>Duration:</strong> {itinerary.duration}</p>
              <p><strong>Price:</strong> ${itinerary.price}</p>
              <button onClick={() => handleBooking(itinerary.name)}>Book</button>
              <button
                onClick={() =>
                  bookmarkedItineraries.includes(itinerary.name)
                    ? handleRemoveBookmark(itinerary.name)
                    : handleBookmarkItinerary(itinerary.name)
                }
              >
                {bookmarkedItineraries.includes(itinerary.name)
                  ? "Remove Bookmark"
                  : "Bookmark"}
              </button>
              <button onClick={() => handleShareItinerary(itinerary.name)}>Share</button>
              <button onClick={() => handleShareViaMail(itinerary.name)}>
                Share via Mail
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>Booked Itineraries</h2>
      {bookedItineraries.length === 0 ? (
        <p>You haven't booked any itineraries yet!</p>
      ) : (
        <ul>
          {bookedItineraries.map((itinerary) => (
            <li key={itinerary}>
              <h3>{itinerary}</h3>
              <p>
                <strong>Your Rating:</strong>
                {ratings[itinerary] ? ratings[itinerary] + " stars" : "Not rated yet"}
              </p>
              <button onClick={() => handleAttendItinerary(itinerary)}>
                Mark as Attended
              </button>

              {/* Only show rating and comment sections if the itinerary is marked as attended */}
              {attendedItineraries.includes(itinerary) && (
                <>
                  <label htmlFor={`rating-${itinerary}`}>Rate this itinerary: </label>
                  <select
                    id={`rating-${itinerary}`}
                    value={ratings[itinerary] || ""}
                    onChange={(e) => handleRateItinerary(itinerary, parseInt(e.target.value))}
                  >
                    <option value="" disabled>Select rating</option>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <option key={star} value={star}>
                        {star} star{star > 1 && "s"}
                      </option>
                    ))}
                  </select>

                  <div>
                    <label htmlFor={`comment-${itinerary}`}>Leave a comment:</label>
                    <textarea
                      id={`comment-${itinerary}`}
                      value={comments[itinerary] || ""}
                      onChange={(e) => handleCommentChange(itinerary, e.target.value)}
                      rows={3}
                      style={{ width: "100%", marginTop: "10px" }}
                      placeholder="Write your comment here..."
                    />
                  </div>
                  <p><strong>Your Comment:</strong> {comments[itinerary] || "No comment yet."}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <h2>Bookmarked Itineraries</h2>
      {bookmarkedItineraries.length === 0 ? (
        <p>No bookmarked itineraries.</p>
      ) : (
        <ul>
          {bookmarkedItineraries.map((itinerary) => (
            <li key={itinerary}>
              <h3>{itinerary}</h3>
              <button onClick={() => handleBooking(itinerary)}>Book</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TouristBookItineraries;
