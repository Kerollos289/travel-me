import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewBookmarkedActivities = () => {
  const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
  const username = localStorage.getItem("username");

  // Fetch bookmarked activities when the component mounts
  useEffect(() => {
    const fetchBookmarkedActivities = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3500/api/touristsAccounts/${username}`
        );
        const { bookmarkedActivities } = response.data;
        setBookmarkedActivities(bookmarkedActivities || []);
      } catch (error) {
        console.error("Error fetching bookmarked activities:", error);
      }
    };

    fetchBookmarkedActivities();
  }, [username]);

  // Handle removing a bookmark
  const handleRemoveBookmark = async (activityName) => {
    try {
      const response = await axios.patch(
        "http://localhost:3500/api/touristsAccounts/removeBookmark",
        {
          username: username,
          activityName: activityName,
        }
      );

      if (response.status === 200) {
        setBookmarkedActivities((prev) =>
          prev.filter((activity) => activity !== activityName)
        );
        alert("Bookmark removed successfully!");
      } else {
        alert(response.data.message || "Failed to remove bookmark.");
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  return (
    <div>
      <h1>Bookmarked Activities</h1>
      {bookmarkedActivities.length === 0 ? (
        <p>You have no bookmarked activities!</p>
      ) : (
        <ul>
          {bookmarkedActivities.map((activityName, index) => (
            <li key={index}>
              <h3>{activityName}</h3>
              <button onClick={() => handleRemoveBookmark(activityName)}>
                Remove Bookmark
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewBookmarkedActivities;
