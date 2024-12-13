//touriststBookActivities.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./activityCategoryPage.css";

import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("your-publishable-key-here");

const TouristBookActivities = () => {
  const [activities, setActivities] = useState([]); // List of all available activities
  const [bookedActivities, setBookedActivities] = useState([]); // Booked activities
  const [paidActivities, setPaidActivities] = useState([]); // Paid activities
  const [attendedActivities, setAttendedActivities] = useState([]); // Attended activities
  const [ratings, setRatings] = useState(
    JSON.parse(localStorage.getItem("activityRatings")) || {}
  );
  const [comments, setComments] = useState(
    JSON.parse(localStorage.getItem("activityComments")) || {}
  );
  const [bookmarkedActivities, setBookmarkedActivities] = useState(
    JSON.parse(localStorage.getItem("bookmarkedActivities")) || []
  );
  const [selectedActivity, setSelectedActivity] = useState(null);

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activitiesResponse = await axios.get(
          "http://localhost:3500/api/activities"
        );
        setActivities(activitiesResponse.data.data);

        const touristResponse = await axios.get(
          `http://localhost:3500/api/touristsAccounts/${username}`
        );
        const { bookedActivity, paidActivity, attendedActivity } =
          touristResponse.data;

        setBookedActivities(bookedActivity || []);
        setPaidActivities(paidActivity || []);
        setAttendedActivities(attendedActivity || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  const handleBooking = async (activityName) => {
    try {
      const response = await axios.patch(
        "http://localhost:3500/api/touristsAccounts/bookActivity",
        { username, activityName }
      );

      if (response.status === 200) {
        setBookedActivities((prev) => [...prev, activityName]);
        setActivities((prev) =>
          prev.filter((activity) => activity.activityName !== activityName)
        );
        alert("Activity booked successfully!");
      } else {
        alert("Failed to book activity.");
      }
    } catch (error) {
      console.error("Error booking activity:", error);
    }
  };

  const handlePayActivity = async (activityName) => {
    try {
      const response = await axios.patch(
        "http://localhost:3500/api/touristsAccounts/payActivity",
        { username, activityName }
      );

      if (response.status === 200) {
        setPaidActivities((prev) => [...prev, activityName]);
        setBookedActivities((prev) =>
          prev.filter((name) => name !== activityName)
        );
        setSelectedActivity(null);
        alert("Activity paid successfully!");
      } else {
        alert("Failed to pay for activity.");
      }
    } catch (error) {
      console.error("Error paying for activity:", error);
    }
  };

  const handleAttendActivity = async (activityName) => {
    try {
      const response = await axios.patch(
        "http://localhost:3500/api/touristsAccounts/attendActivity",
        { username, activityName }
      );

      if (response.status === 200) {
        setAttendedActivities((prev) => [...prev, activityName]);
        setPaidActivities((prev) =>
          prev.filter((name) => name !== activityName)
        );
        alert("Activity marked as attended successfully!");
      } else {
        alert("Failed to mark activity as attended.");
      }
    } catch (error) {
      console.error("Error attending activity:", error);
    }
  };

  const handleCancelBooking = async (activityName) => {
    try {
      const response = await axios.patch(
        "http://localhost:3500/api/touristsAccounts/removeActivity",
        { username, activityName }
      );

      if (response.status === 200) {
        setBookedActivities((prev) =>
          prev.filter((name) => name !== activityName)
        );
        alert("Activity booking cancelled successfully!");
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleBookmarkActivity = async (activityName) => {
    try {
      const response = await axios.patch(
        "http://localhost:3500/api/touristsAccounts/bookmarkActivity",
        {
          username: username,
          activityName: activityName,
        }
      );

      if (response.status === 200) {
        setBookmarkedActivities((prev) => [...prev, activityName]);
        alert("Activity bookmarked successfully!");
      } else {
        alert(response.data.message || "Failed to bookmark activity.");
      }
    } catch (error) {
      console.error("Error bookmarking activity:", error);
    }
  };

  const handleRateActivity = (activityName, rating) => {
    const updatedRatings = { ...ratings, [activityName]: rating };
    setRatings(updatedRatings);
    localStorage.setItem("activityRatings", JSON.stringify(updatedRatings));
  };

  // const handleRateActivity = async (activityName, rating, comment) => {
  //   try {
  //     const response = await axios.patch(
  //       "http://localhost:3500/api/rateActivity",
  //       {
  //         username,
  //         activityName,
  //         rating,
  //         comment,
  //       }
  //     );

  //     if (response.status === 200) {
  //       alert("Rating and comment submitted successfully.");
  //     } else {
  //       alert("Failed to submit rating and comment.");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting rating and comment:", error);
  //   }
  // };

  const handleCommentChange = (activityName, comment) => {
    const updatedComments = { ...comments, [activityName]: comment };
    setComments(updatedComments);
    localStorage.setItem("activityComments", JSON.stringify(updatedComments));
  };

  const handleShareActivity = (activityName) => {
    const activityUrl = `http://localhost:4200/activity/${activityName}`;
    alert(`You can share this activity via link: ${activityUrl}`);
  };

  const handleShareViaMail = (activityName) => {
    const activityUrl = `http://localhost:4200/activity/${activityName}`;
    const subject = `Check out this amazing activity: ${activityName}`;
    const body = `I found this great activity and thought you would be interested in it!\n\nActivity: ${activityName}\nLink: ${activityUrl}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <Elements stripe={stripePromise}>
      <div>
        <h1>Available Activities</h1>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.activityName}>
              <h3>{activity.activityName}</h3>
              <p>{activity.description}</p>
              <p>
                <strong>Duration:</strong> {activity.duration}
              </p>
              <p>
                <strong>Price:</strong> ${activity.price}
              </p>
              <button onClick={() => handleBooking(activity.activityName)}>
                Book
              </button>
              <button
                onClick={() => handleShareActivity(activity.activityName)}
              >
                Share by Link
              </button>
              <button onClick={() => handleShareViaMail(activity.activityName)}>
                Share by Mail
              </button>
              <button
                onClick={() => handleBookmarkActivity(activity.activityName)}
                disabled={bookmarkedActivities.includes(activity.activityName)}
              >
                {bookmarkedActivities.includes(activity.activityName)
                  ? "Bookmarked"
                  : "Bookmark"}
              </button>
            </div>
          ))
        ) : (
          <p>No activities available!</p>
        )}

        <h2>Booked Activities</h2>
        {bookedActivities.length > 0 ? (
          bookedActivities.map((activityName) => (
            <div key={activityName}>
              <h3>{activityName}</h3>
              <button onClick={() => setSelectedActivity(activityName)}>
                Pay
              </button>
              <button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "red",
                  color: "white",
                }}
                onClick={() => handleCancelBooking(activityName)}
              >
                Cancel Booking
              </button>
            </div>
          ))
        ) : (
          <p>You haven't booked any activities yet!</p>
        )}
        {selectedActivity && (
          <div>
            <h3>Pay for {selectedActivity}</h3>
            <CardElement /> {/* This will render the credit card input field */}
            <button onClick={() => handlePayActivity(selectedActivity)}>
              Pay Now
            </button>
          </div>
        )}

        <h2>Paid Activities</h2>
        {paidActivities.length > 0 ? (
          paidActivities.map((activityName) => (
            <div key={activityName}>
              <h3>{activityName}</h3>
              <button onClick={() => handleAttendActivity(activityName)}>
                Mark as Attended
              </button>
            </div>
          ))
        ) : (
          <p>No paid activities yet!</p>
        )}

        <h2>Attended Activities</h2>
        {attendedActivities.map((activityName) => (
          <div key={activityName}>
            <h3>{activityName}</h3>
            <textarea
              placeholder="Leave a comment"
              value={comments[activityName] || ""}
              onChange={(e) =>
                handleCommentChange(activityName, e.target.value)
              }
            />
            <br />
            <label>
              Rate:{" "}
              <select
                value={ratings[activityName] || ""}
                onChange={(e) =>
                  handleRateActivity(activityName, e.target.value)
                }
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
    </Elements>
  );
};
const TouristBookActivitiesWrapper = () => (
  <Elements stripe={stripePromise}>
    <TouristBookActivities />
  </Elements>
);

export default TouristBookActivitiesWrapper;
