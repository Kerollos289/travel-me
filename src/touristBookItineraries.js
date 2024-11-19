import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";

// Stripe promise setup with your publishable key
const stripePromise = loadStripe("your-publishable-key-here");

const TouristBookItineraries = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [itineraries, setItineraries] = useState([]);
  const [bookedItineraries, setBookedItineraries] = useState([]);
  const [paidItineraries, setPaidItineraries] = useState([]);
  const [attendedItineraries, setAttendedItineraries] = useState([]);
  const [bookmarkedItineraries, setBookmarkedItineraries] = useState(
    JSON.parse(localStorage.getItem("bookmarkedItineraries")) || []
  );
  const [ratings, setRatings] = useState(
    JSON.parse(localStorage.getItem("itineraryRatings")) || {}
  );
  const [comments, setComments] = useState(
    JSON.parse(localStorage.getItem("itineraryComments")) || {}
  );
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      const itinerariesResponse = await axios.get("http://localhost:3500/api/itineraries");
      const allItineraries = itinerariesResponse.data;

      try {
        const touristResponse = await axios.get(
          `http://localhost:3500/api/touristsAccounts/${username}`
        );

        const { bookedItineraries, paidItineraries, attendedItineraries } = touristResponse.data;
        const availableItineraries = allItineraries.filter(
          (itinerary) => !bookedItineraries.includes(itinerary.name)
        );

        setItineraries(availableItineraries);
        setBookedItineraries(bookedItineraries);
        setPaidItineraries(paidItineraries);
        setAttendedItineraries(attendedItineraries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  // Function to handle booking an itinerary
  const handleBooking = async (itineraryName) => {
    try {
      const response = await axios.patch(
        "http://localhost:3500/api/touristsAccounts/bookItinerary",
        {
          username: username,
          itineraryName: itineraryName,
        }
      );

      if (response.status === 200) {
        setBookedItineraries((prev) => [...prev, itineraryName]);
        setItineraries((prev) => prev.filter((itinerary) => itinerary.name !== itineraryName));
        alert("Itinerary booked successfully!");
      } else {
        alert("Failed to book itinerary.");
      }
    } catch (error) {
      console.error("Error booking itinerary:", error);
    }
  };


  // Function to handle paying for an itinerary with Stripe
  
  // Function to handle paying for an itinerary
  const handlePayItinerary = async (itineraryName) => {
    try {
      const response = await axios.patch(
        "http://localhost:3500/api/touristsAccounts/payItinerary",
        {
          username: username,
          itineraryName: itineraryName,
        }
      );

      if (response.status === 200) {
        // Move itinerary to paid list
        setPaidItineraries((prev) => [...prev, itineraryName]);
        setBookedItineraries((prev) => prev.filter((name) => name !== itineraryName));
        setSelectedItinerary(null);
        alert("Itinerary paid successfully! A receipt has been sent to your email.");
        
      } else {
        alert("Failed to pay for itinerary.");
      }
    } catch (error) {
      console.error("Error paying for itinerary:", error);
    }
  };


  const handleAttendItinerary = async (itineraryName) => {
    try {
      const response = await axios.patch(
        "http://localhost:3500/api/touristsAccounts/attendItinerary",
        {
          username: username,
          itineraryName: itineraryName,
        }
      );
  
      if (response.status === 200) {
        // Add the itinerary to the attended itineraries state
        const updatedAttendedItineraries = [...attendedItineraries, itineraryName];
        setAttendedItineraries(updatedAttendedItineraries);
  
        // Also store it in local storage
        localStorage.setItem(
          "attendedItineraries",
          JSON.stringify(updatedAttendedItineraries)
        );
  
        // Remove from paid and booked itineraries
        setPaidItineraries((prev) => prev.filter((name) => name !== itineraryName));
        setBookedItineraries((prev) => prev.filter((name) => name !== itineraryName));
  
        alert(`Itinerary "${itineraryName}" marked as attended successfully!`);
      } else {
        alert("Failed to mark itinerary as attended.");
      }
    } catch (error) {
      console.error("Error attending itinerary:", error);
      alert("An error occurred while marking the itinerary as attended.");
    }
  };

  const handleCancelBooking = async (itineraryName) => {
    try {
      const response = await axios.patch(
        "http://localhost:3500/api/touristsAccounts/cancelBooking",
        {
          username: username,
          itineraryName: itineraryName,
        }
      );
  
      if (response.status === 200) {
        // Remove itinerary from booked itineraries
        setBookedItineraries((prev) => prev.filter((name) => name !== itineraryName));
        setItineraries((prev) => [...prev, { name: itineraryName }]); // Add it back to available itineraries
        alert("Booking canceled successfully!");
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };
  


  const handleRateItinerary = (itineraryName, rating) => {
    const updatedRatings = { ...ratings, [itineraryName]: rating };
    setRatings(updatedRatings);
    localStorage.setItem("itineraryRatings", JSON.stringify(updatedRatings));
  };

  const handleCommentChange = (itineraryName, comment) => {
    const updatedComments = { ...comments, [itineraryName]: comment };
    setComments(updatedComments);
    localStorage.setItem("itineraryComments", JSON.stringify(updatedComments));
  };

  const handleBookmarkItinerary = (itineraryName) => {
    const updatedBookmarkedItineraries = [...bookmarkedItineraries, itineraryName];
    setBookmarkedItineraries(updatedBookmarkedItineraries);
    localStorage.setItem("bookmarkedItineraries", JSON.stringify(updatedBookmarkedItineraries));
  };

  const handleRemoveBookmark = (itineraryName) => {
    const updatedBookmarkedItineraries = bookmarkedItineraries.filter(
      (name) => name !== itineraryName
    );
    setBookmarkedItineraries(updatedBookmarkedItineraries);
    localStorage.setItem("bookmarkedItineraries", JSON.stringify(updatedBookmarkedItineraries));
  };

  const handleShareItinerary = (itineraryName) => {
    const itineraryUrl = `http://localhost:4200/itinerary/${itineraryName}`;
    alert(`You can share this itinerary via link: ${itineraryUrl}`);
  };

  const handleShareViaMail = (itineraryName) => {
    const itineraryUrl = `http://localhost:4200/itinerary/${itineraryName}`;
    const subject = `Check out this amazing itinerary: ${itineraryName}`;
    const body = `I found this great itinerary and thought you would be interested in it!\n\nItinerary: ${itineraryName}\nLink: ${itineraryUrl}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  return (
    <Elements stripe={stripePromise}>
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
        <p>No booked itineraries.</p>
      ) : (
        <ul>
          {bookedItineraries.map((itinerary) => (
            <li key={itinerary}>
              <h3>{itinerary}</h3>
              <button onClick={() => setSelectedItinerary(itinerary)}>Pay</button>
              <button onClick={() => handleCancelBooking(itinerary)}>Cancel Booking</button>
            </li>
          ))}
        </ul>
      )}

      {selectedItinerary && (
        <div>
          <h3>Pay for {selectedItinerary}</h3>
          <CardElement /> {/* This will render the credit card input field */}
          <button onClick={() => handlePayItinerary(selectedItinerary)}>Pay Now</button>
        </div>
      )}

    <h2>Paid Itineraries</h2>
      {paidItineraries.length === 0 ? (
        <p>No paid itineraries.</p>
      ) : (
        <ul>
          {paidItineraries.map((itinerary) => (
            <li key={itinerary}>
              <h3>{itinerary}</h3>
              <button onClick={() => handleAttendItinerary(itinerary)}>Mark as Attended</button>
            </li>
          ))}
        </ul>
      )}



<h2>Attended Itineraries</h2>
      {attendedItineraries.length === 0 ? (
        <p>No attended itineraries yet!</p>
      ) : (
        <ul>
          {attendedItineraries.map((itinerary) => (
            <li key={itinerary}>
              <h3>{itinerary}</h3>
              <select
                value={ratings[itinerary] || ""}
                onChange={(e) => handleRateItinerary(itinerary, e.target.value)}
              >
                <option value="">Rate</option>
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star} Star{star > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Leave a comment"
                value={comments[itinerary] || ""}
                onChange={(e) => handleCommentChange(itinerary, e.target.value)}
              />
            </li>
          ))}
        </ul>
      )}


      <h2>Bookmarked Itineraries</h2>
{bookmarkedItineraries.length === 0 ? (
  <p>No bookmarked itineraries yet!</p>
) : (
  <ul>
    {bookmarkedItineraries.map((itinerary) => (
      <li key={itinerary}>
        <h3>{itinerary}</h3>
        {/* Remove bookmark button */}
        <button onClick={() => handleRemoveBookmark(itinerary)}>Remove Bookmark</button>
      </li>
    ))}
  </ul>
)}
</div>
    </Elements>
  );
};

const TouristBookItinerariesWrapper = () => (
  <Elements stripe={stripePromise}>
    <TouristBookItineraries />
  </Elements>
);

export default TouristBookItinerariesWrapper;