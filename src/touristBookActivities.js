import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristBookActivities = () => {
  const [activities, setActivities] = useState([]);
  const [bookedActivity, setBookedActivities] = useState([]);
  const [bookmarkedActivities, setBookmarkedActivities] = useState(
    JSON.parse(localStorage.getItem("bookmarkedActivities")) || []
  );
  const [attendedActivities, setAttendedActivities] = useState(
    JSON.parse(localStorage.getItem("attendedActivities")) || []
  );
  const [ratings, setRatings] = useState(
    JSON.parse(localStorage.getItem("activityRatings")) || {}
  );
  const [comments, setComments] = useState(
    JSON.parse(localStorage.getItem("activityComments")) || {}
  );
  const username = localStorage.getItem("username");

  // Fetch activities when component mounts
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3500/api/activities"
        );
        const allActivities = response.data.data;

        const touristResponse = await axios.get(
          `http://localhost:3500/api/touristsAccounts/${username}`
        );
        const { bookedActivity } = touristResponse.data;
        const availableActivities = allActivities.filter(
          (activity) => !bookedActivity.includes(activity.activityName)
        );

        setActivities(availableActivities);
        setBookedActivities(bookedActivity);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [username]);

  // Handle activity booking
  const handleBookActivity = async (activityName) => {
    try {
      const response = await axios.patch(
        `http://localhost:3500/api/touristsAccounts/bookActivity`,
        {
          username: username,
          activityName: activityName,
        }
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

  // Handle bookmarking
  const handleBookmarkActivity = (activityName) => {
    const updatedBookmarks = [...bookmarkedActivities, activityName];
    setBookmarkedActivities(updatedBookmarks);
    localStorage.setItem("bookmarkedActivities", JSON.stringify(updatedBookmarks));
    alert(`Activity "${activityName}" bookmarked!`);
  };

  // Handle unbookmarking
  const handleUnbookmarkActivity = (activityName) => {
    const updatedBookmarks = bookmarkedActivities.filter(
      (name) => name !== activityName
    );
    setBookmarkedActivities(updatedBookmarks);
    localStorage.setItem("bookmarkedActivities", JSON.stringify(updatedBookmarks));
    alert(`Activity "${activityName}" removed from bookmarks!`);
  };

  // Mark activity as attended
  const handleAttendActivity = (activityName) => {
    const updatedAttendedActivities = [...attendedActivities, activityName];
    setAttendedActivities(updatedAttendedActivities);
    localStorage.setItem(
      "attendedActivities",
      JSON.stringify(updatedAttendedActivities)
    );
  };

  // Handle rating
  const handleRateActivity = (activityName, rating) => {
    const updatedRatings = { ...ratings, [activityName]: rating };
    setRatings(updatedRatings);
    localStorage.setItem("activityRatings", JSON.stringify(updatedRatings));
  };

  // Handle commenting
  const handleCommentChange = (activityName, comment) => {
    const updatedComments = { ...comments, [activityName]: comment };
    setComments(updatedComments);
    localStorage.setItem("activityComments", JSON.stringify(updatedComments));
  };

  // Share activity via email
  const shareViaEmail = (activityName) => {
    const subject = `Check out this activity: ${activityName}`;
    const body = `I thought you might be interested in this activity: ${activityName}.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Share activity via link
  const shareViaLink = (activityName) => {
    const url = window.location.href; // Get current page URL
    alert(`Share this activity using this link: ${url}`);
  };

  return (
    <div>
      <h1>Available Activities</h1>
      {activities.length === 0 ? (
        <p>No activities available to book!</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity._id}>
              <h3>{activity.activityName}</h3>
              <p>{activity.description}</p>
              <p>{activity.location}</p>
              <button onClick={() => handleBookActivity(activity.activityName)}>
                Book
              </button>
              {bookmarkedActivities.includes(activity.activityName) ? (
                <button
                  onClick={() => handleUnbookmarkActivity(activity.activityName)}
                >
                  Remove Bookmark
                </button>
              ) : (
                <button
                  onClick={() => handleBookmarkActivity(activity.activityName)}
                >
                  Bookmark
                </button>
              )}
              <div>
                <button onClick={() => shareViaEmail(activity.activityName)}>
                  Share via Email
                </button>
                <button onClick={() => shareViaLink(activity.activityName)}>
                  Share via Link
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2>Bookmarked Activities</h2>
      {bookmarkedActivities.length === 0 ? (
        <p>No bookmarked activities!</p>
      ) : (
        <ul>
          {bookmarkedActivities.map((activityName) => (
            <li key={activityName}>
              <h3>{activityName}</h3>
              <button onClick={() => handleUnbookmarkActivity(activityName)}>
                Remove Bookmark
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>Booked Activities</h2>
      <ul>
        {bookedActivity.map((activity) => (
          <li key={activity}>
            <h3>{activity}</h3>
            <button onClick={() => handleAttendActivity(activity)}>
              Mark as Attended
            </button>

            {attendedActivities.includes(activity) && (
              <>
                <label htmlFor={`rating-${activity}`}>Rate this activity: </label>
                <select
                  id={`rating-${activity}`}
                  value={ratings[activity] || ""}
                  onChange={(e) =>
                    handleRateActivity(activity, parseInt(e.target.value))
                  }
                >
                  <option value="" disabled>
                    Select rating
                  </option>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>
                      {star} star{star > 1 && "s"}
                    </option>
                  ))}
                </select>

                <div>
                  <label htmlFor={`comment-${activity}`}>
                    Leave a comment:
                  </label>
                  <textarea
                    id={`comment-${activity}`}
                    value={comments[activity] || ""}
                    onChange={(e) =>
                      handleCommentChange(activity, e.target.value)
                    }
                    rows={3}
                    style={{ width: "100%", marginTop: "10px" }}
                    placeholder="Write your comment here..."
                  />
                </div>
                <p>
                  <strong>Your Comment:</strong>{" "}
                  {comments[activity] || "No comment yet."}
                </p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TouristBookActivities;
