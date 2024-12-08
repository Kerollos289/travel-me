//index.js
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
app.use(cors());
const mongoose = require("mongoose");
const forgetPasswordRoutes = require("./routes/forgetPasswordRoutes");
const touristAccount = require("./models/touristsAccounts.models.js");
const Itinerary = require("./models/itinerary.model.js");
const Activity = require("./models/activity.model.js");
const tourist = require("./models/touristsAccounts.models.js");
const travelJobAccount = require("./models/travelJobsAccounts.models.js");
const tourismGovernor = require("./models/tourismGoverners.models.js");
const admin = require("./models/admin.models.js");
const travelJobAccountRoutes = require("./routes/travelJobsAccounts.routes.js");
const itineraryRoutes = require("./routes/itinerary.routes.js");
const museumRoutes = require("./routes/museum.routes.js");
const Museum = require("./models/museum.model.js");
const Rating = require("./models/rating.model"); // Rating model
const BookingFlight = require("./models/bookFlights.model.js");
const HotelBooking = require("./models/hotel.model.js");
const Complaint = require("./models/complaint.models.js");

const activityRoutes = require("./routes/activity.routes.js");

const activityCategoryRoutes = require("./routes/activityCategory.routes.js");
const preferenceTagsRoutes = require("./routes/preferenceTags.routes.js");
const salesRoutes = require("./routes/sales.routes.js");
const guestSalesRoutes = require("./routes/guestSales.routes.js");
const forgetPassword = require("./routes/forgetPasswordRoutes.js");
const DocumentRequest = require("./models/DocumentRequest.js");
const bookingRoutes = require("./routes/booking.routes.js");

const path = require("path");
const fs = require("fs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Import the activity routes
const Account = require("./models/travelJobsAccounts.models.js"); // Adjust path to your model
const Account1 = require("./models/touristsAccounts.models.js");
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the forget password routes

// GET route to fetch the profile by username

const PORT = process.env.PORT || 3500;
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/museums", museumRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/activityCategory", activityCategoryRoutes);
app.use("/api/preferenceTags", preferenceTagsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/guest-sales", guestSalesRoutes);
app.use("/api/forget-password", forgetPassword);
app.use("/api/activity", activityRoutes);
app.use("/api/bookings", bookingRoutes);
//app.use("/api/travelJobAccount", travelJobAccountRoutes);

const deleteRequestSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
});

const DeleteRequest = mongoose.model("DeleteRequest", deleteRequestSchema);

app.use("/api/forget-password", forgetPasswordRoutes);

app.post("/bookHotel/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const {
      hotelId,
      roomType,
      price,
      currency,
      checkInDate,
      checkOutDate,
      address = "Unknown",
      name = "Unnamed Hotel",
    } = req.body;

    // Check if tourist exists
    const tourist = await touristAccount.findOne({ username });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Create new hotel booking
    const newBooking = new HotelBooking({
      username,
      name,
      address,
      // Get the touristId from the URL parameter
      hotelId,
      roomType,
      price,
      currency,
      checkInDate: checkInDate,
      checkOutDate,
    });

    // Save the booking
    await newBooking.save();

    return res.status(201).json({
      message: "Hotel booked successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/tourist/complaints", async (req, res) => {
  const { touristUsername } = req.query;

  // Ensure touristUsername is provided
  if (!touristUsername) {
    return res.status(400).json({ message: "Tourist username is required." });
  }

  try {
    // Query the complaints for the specific tourist
    const complaints = await Complaint.find({ touristUsername });

    // If no complaints found, return an empty array
    if (!complaints) {
      return res.status(404).json({ message: "No complaints found." });
    }

    res.status(200).json(complaints); // Respond with the complaints
  } catch (error) {
    // If there was a database error, return a 500 Internal Server Error
    console.error(error);
    res.status(500).json({ message: "Failed to fetch complaints.", error });
  }
});

app.get("/api/admin/complaints", async (req, res) => {
  try {
    const { status, sort } = req.query; // Retrieve filter and sort query parameters
    const filter = status ? { status } : {}; // Filter by status if provided
    const sortOption = sort === "asc" ? { date: 1 } : { date: -1 }; // Sort by date ascending or descending

    const complaints = await Complaint.find(filter).sort(sortOption); // Apply filter and sort
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch complaints.", error });
  }
});
app.put("/api/admin/complaints/:id/resolve", async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status: "resolved" },
      { new: true }
    );
    res.status(200).json({ message: "Complaint resolved.", complaint });
  } catch (error) {
    res.status(500).json({ message: "Failed to resolve complaint.", error });
  }
});
app.put("/api/admin/complaints/:id/reply", async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { reply: reply },
      { new: true }
    );
    res.status(200).json({ message: "Reply added.", complaint });
  } catch (error) {
    res.status(500).json({ message: "Failed to add reply.", error });
  }
});

app.post("/api/tourist/file-complaint", async (req, res) => {
  try {
    const { title, body, touristUsername } = req.body;

    if (!title || !body || !touristUsername) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const complaint = new Complaint({ title, body, touristUsername });
    await complaint.save();

    res
      .status(201)
      .json({ message: "Complaint filed successfully.", complaint });
  } catch (error) {
    res.status(500).json({ message: "Failed to file complaint.", error });
  }
});

// Get Hotel Bookings by Tourist ID
app.get("/getHotelBookings/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find all hotel bookings by touristId
    const bookings = await HotelBooking.find({ username: username });

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "No hotel bookings found for this tourist" });
    }

    return res.status(200).json({
      message: "Hotel bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/getFlightBookings/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find all flight bookings by touristId
    const bookings = await BookingFlight.find({ touristId: username });

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "No flight bookings found for this tourist" });
    }

    return res.status(200).json({
      message: "Flight bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/bookFlight/:username", async (req, res) => {
  try {
    const {
      airline,
      flightNumber1,
      departure1,
      arrival1,
      flightNumber2,
      departure2,
      arrival2,
      price,
      currency,
    } = req.body;

    // Create the booking
    const newBooking = new BookingFlight({
      touristId: req.params.username, // Get the touristId from the URL parameter
      airline,
      flightNumber1,
      departure1,
      arrival1,
      flightNumber2,
      departure2,
      arrival2,
      price,
      currency,
    });

    // Save the booking
    const savedBooking = await newBooking.save();

    // Send a success response
    res.status(201).json({
      message: "Flight successfully booked!",
      booking: savedBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while booking the flight.",
      error: err.message,
    });
  }
});

// Convert loyalty points to wallet credit (10 points = 1 credit)
app.post("/api/convert-loyalty-to-wallet/:username", async (req, res) => {
  const { username } = req.params;
  try {
    // Find tourist by username
    const tourist = await touristAccount.findOne({ username });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const loyaltyPoints = tourist.loyaltyPoints || 0;

    // Ensure tourist has at least 10 loyalty points
    if (loyaltyPoints < 10) {
      return res.status(400).json({ message: "Not enough loyalty points" });
    }

    // Convert loyalty points to wallet credit (10 points = 1 credit)
    const walletCreditsToAdd = Math.floor(loyaltyPoints / 10);
    tourist.wallet += walletCreditsToAdd;
    tourist.loyaltyPoints -= walletCreditsToAdd * 10;

    // Save the updated tourist data
    await tourist.save();

    return res.status(200).json({
      message: `${walletCreditsToAdd} wallet credits added.`,
      wallet: tourist.wallet,
      loyaltyPoints: tourist.loyaltyPoints,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});


// app.post("/api/getAttendedItineraries", async (req, res) => {
//   try {
//     const { username } = req.body;

//     // Fetch the tourist by username
//     const tourist = await touristAccount.findOne({ username });
//     if (!tourist) return res.status(404).json({ message: "Tourist not found" });

//     const attendedItineraries = tourist.attendedItineraries;

//     // Fetch itineraries based on attended itinerary names
//     const itineraries = await Itinerary.find({
//       name: { $in: attendedItineraries },
//     }).populate("_id", "username"); // Fetch the tour guide's username

//     res.json(itineraries);
//   } catch (error) {
//     res.status(500).json({ message: error.message, stack: error.stack });
//   }
// });

// app.post("/api/getAttendedItineraries", async (req, res) => {
//   try {
//     const { username } = req.body;

//     // Fetch the tourist by username
//     const tourist = await touristAccount.findOne({ username });
//     if (!tourist) return res.status(404).json({ message: "Tourist not found" });

//     const attendedItineraries = tourist.attendedItineraries;

//     // Fetch itineraries and their associated tour guides
//     const itineraries = await Itinerary.find({
//       name: { $in: attendedItineraries },
//     });

//     const itinerariesWithTourGuides = await Promise.all(
//       itineraries.map(async (itinerary) => {
//         const tourGuide = await travelJobsAccount.findOne({
//           itinerariesArray: itinerary.name,
//         });

//         return {
//           ...itinerary.toObject(),
//           tourGuideUsername: tourGuide ? tourGuide.username : "Unknown",
//         };
//       })
//     );

//     res.json(itinerariesWithTourGuides);
//   } catch (error) {
//     res.status(500).json({ message: error.message, stack: error.stack });
//   }
// });

app.post("/api/getAttendedItineraries", async (req, res) => {
  try {
    const { username } = req.body;

    // Fetch the tourist by username
    const tourist = await touristAccount.findOne({ username });
    if (!tourist) {
      console.error("Tourist not found");
      return res.status(404).json({ message: "Tourist not found" });
    }

    const attendedItineraries = tourist.attendedItineraries;

    // Fetch itineraries
    const itineraries = await Itinerary.find({
      name: { $in: attendedItineraries },
    });

    // Match itineraries with tour guide usernames
    const itinerariesWithTourGuides = await Promise.all(
      itineraries.map(async (itinerary) => {
        const tourGuide = await travelJobAccount.findOne({
          itinerariesArray: itinerary.name,
        });

        return {
          ...itinerary.toObject(),
          tourGuideUsername: tourGuide ? tourGuide.username : "Unknown",
        };
      })
    );

    res.json(itinerariesWithTourGuides);
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

app.post("/api/submitRating", async (req, res) => {
  try {
    const { tourGuideUsername, itineraryName, username, rating, comment } =
      req.body;

    // Find the tourist in the database
    const tourist = await touristAccount.findOne({ username });
    if (!tourist) {
      console.error("Tourist not found for username:", username);
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Create and save a new rating
    const newRating = new Rating({
      tourGuideUsername,
      itineraryName,
      touristId: tourist._id,
      rating,
      comment,
    });

    await newRating.save();

    res.json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error in /api/submitRating:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

app.patch("/api/touristsAccounts/bookmarkActivity", async (req, res) => {
  const { username, activityName } = req.body;
  try {
    await touristAccount.updateOne(
      { username },
      { $addToSet: { bookmarkedActivities: activityName } }
    );
    res.status(200).send({ message: "Activity bookmarked successfully!" });
  } catch (error) {
    res.status(500).send({ error: "Failed to bookmark activity." });
  }
});

// Endpoint to remove a bookmark
app.patch("/api/touristsAccounts/removeBookmark", async (req, res) => {
  const { username, activityName } = req.body;
  try {
    await touristAccount.updateOne(
      { username },
      { $pull: { bookmarkedActivities: activityName } }
    );
    res.status(200).send({ message: "Bookmark removed successfully!" });
  } catch (error) {
    res.status(500).send({ error: "Failed to remove bookmark." });
  }
});

// 1. Get Preferences for a specific tourist
app.get("/api/tourist/preferences", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send({ error: "Username is required." });
  }

  try {
    const tourist = await touristAccount.findOne({ username });
    if (!tourist) {
      return res.status(404).send({ error: "Tourist not found." });
    }

    res.status(200).send({ preferences: tourist.preferences });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send({ error: "Internal server error." });
  }
});

// 2. Add a new preference to the tourist
app.post("/api/tourist/preferences", async (req, res) => {
  const { username, preference } = req.body;

  if (!username || !preference) {
    return res
      .status(400)
      .send({ error: "Username and preference are required." });
  }

  try {
    const tourist = await touristAccount.findOne({ username });
    if (!tourist) {
      return res.status(404).send({ error: "Tourist not found." });
    }

    tourist.preferences.push(preference); // Add preference
    await tourist.save();

    res.status(201).send({ message: "Preference added successfully." });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send({ error: "Internal server error." });
  }
});

// 3. Delete a preference at a specific index
app.delete("/api/tourist/preferences/:index", async (req, res) => {
  const { username } = req.query;
  const { index } = req.params;

  if (!username) {
    return res.status(400).send({ error: "Username is required." });
  }

  try {
    const tourist = await touristAccount.findOne({ username });
    if (!tourist) {
      return res.status(404).send({ error: "Tourist not found." });
    }

    if (index < 0 || index >= tourist.preferences.length) {
      return res.status(400).send({ error: "Invalid preference index." });
    }

    tourist.preferences.splice(index, 1); // Remove preference by index
    await tourist.save();

    res.status(200).send({ message: "Preference deleted successfully." });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send({ error: "Internal server error." });
  }
});

app.get("/api/museumsFilter", async (req, res) => {
  const { name, locationType } = req.query; // Get filters from query parameters

  try {
    const filter = {};

    if (name) {
      filter.name = new RegExp(name, "i"); // Case-insensitive search for the name
    }

    if (locationType) {
      filter.locationType = locationType; // Filter by location type (category)
    }

    const museums = await Museum.find(filter); // Apply filters to the query
    res.json(museums);
  } catch (error) {
    console.error("Error fetching museums:", error);
    res.status(500).send("Server error");
  }
});

app.get("/api/user-counts", async (req, res) => {
  try {
    const currentMonth = new Date().getMonth(); // Current month (0-11)
    const currentYear = new Date().getFullYear(); // Current year

    const totalTravelJobsAccounts = await travelJobAccount.countDocuments();
    const totalTouristsAccounts = await tourist.countDocuments();
    const totalTourGovernors = await tourismGovernor.countDocuments();

    const usersThisMonthTravelJobs = await travelJobAccount.countDocuments({
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });
    const usersThisMonthTourists = await tourist.countDocuments({
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });
    const usersThisMonthGovernors = await tourismGovernor.countDocuments({
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });

    const totalUsers =
      totalTravelJobsAccounts + totalTouristsAccounts + totalTourGovernors;
    const usersThisMonth =
      usersThisMonthTravelJobs +
      usersThisMonthTourists +
      usersThisMonthGovernors;

    res.status(200).json({ totalUsers, usersThisMonth });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/flagActivity/:id", async (req, res) => {
  try {
    const activityId = req.params.id;
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json({ message: "activity not found" });
    }

    activity.isFlagged = true;
    activity.notificationClosed = false;
    await activity.save();

    const owner = await travelJobAccount.findOne({
      activitiesArray: activity.activityName,
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "kerollosashraffahamine@gmail.com",
        pass: "aiyw spoz fzci jkix", // Use an app-specific password if necessary
      },
    });

    const mailOptions = {
      from: "kerollosashraffahamine@gmail.com",
      to: owner.email,
      subject: "acrivity Flagged",
      text: `Your activity "${activity.activityName}" has been flagged for review. Please contact support for further information.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "activity flagged and owner notified" });
  } catch (error) {
    console.error("Error in /flagactivity:", error); // Log the error
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

app.post("/api/flagItinerary/:id", async (req, res) => {
  try {
    const itineraryId = req.params.id;
    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    itinerary.isFlagged = true;
    itinerary.notificationClosed = false;
    await itinerary.save();

    const owner = await travelJobAccount.findOne({
      itinerariesArray: itinerary.name,
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "kerollosashraffahamine@gmail.com",
        pass: "aiyw spoz fzci jkix", // Use an app-specific password if necessary
      },
    });

    const mailOptions = {
      from: "kerollosashraffahamine@gmail.com",
      to: owner.email,
      subject: "Itinerary Flagged",
      text: `Your itinerary "${itinerary.name}" has been flagged for review. Please contact support for further information.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Itinerary flagged and owner notified" });
  } catch (error) {
    console.error("Error in /flagItinerary:", error); // Log the error
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

app.get(
  "/api/travelJobsAccounts/tourGuideReport/:username",
  async (req, res) => {
    try {
      const username = req.params.username;
      const { month } = req.query; // Get the month from query parameters (optional)

      if (!username) {
        return res.status(400).send("Username is required");
      }

      const tourGuide = await travelJobAccount.findOne({ username });
      if (!tourGuide) {
        return res.status(404).send("Tour Guide not found");
      }

      const itinerariesArray = tourGuide.itinerariesArray;
      let report = {};

      for (let itineraryName of itinerariesArray) {
        // Find the itinerary by name
        const itinerary = await Itinerary.findOne({ name: itineraryName });
        if (!itinerary) continue;

        // Filter itineraries based on the selected month
        if (month) {
          const filteredDates = itinerary.availableDates.filter((date) => {
            const itineraryMonth = new Date(date).getMonth() + 1; // JS months are 0-indexed
            return itineraryMonth === parseInt(month);
          });

          if (filteredDates.length === 0) continue; // Skip if no matching dates
        }

        // Count tourists registered for this itinerary
        const tourists = await touristAccount.find({
          bookedItineraries: itineraryName,
        });
        report[itineraryName] =
          tourists.length > 0 ? tourists.length : "Deleted";
      }

      res.status(200).json(report);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

app.get(
  "/api/travelJobsAccounts/advertiserReport/:username",
  async (req, res) => {
    try {
      const username = req.params.username; // Extract from path parameters
      const { month } = req.query; // Extract the month query parameter

      if (!username) {
        return res.status(400).send("Username is required");
      }

      const advertiser = await travelJobAccount.findOne({ username });
      if (!advertiser) {
        return res.status(404).send("Advertiser not found");
      }

      const activitiesArray = advertiser.activitiesArray;
      let report = {};

      for (let activity of activitiesArray) {
        // Check if the activity exists in the database
        const activityDetails = await Activity.findOne({
          activityName: activity,
        });

        if (activityDetails) {
          const activityMonth = new Date(activityDetails.date).getMonth() + 1; // Extract month (0-based index)

          // If the month filter is applied, skip activities not in the selected month
          if (month && parseInt(month) !== activityMonth) {
            continue;
          }

          // Find tourists who booked this activity
          const tourists = await touristAccount.find({
            bookedActivity: activity,
          });

          if (tourists.length > 0) {
            report[activity] = tourists.length; // Only include activities with bookings
          }
        }
      }

      res.status(200).json(report); // Send the filtered report
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

app.patch("/api/touristsAccounts/bookActivity", async (req, res) => {
  try {
    const { username, activityName } = req.body;

    const tourist = await touristAccount.findOneAndUpdate(
      { username },
      { $addToSet: { bookedActivity: activityName } },
      { new: true }
    );

    if (!tourist) {
      //console.error("Tourist not found:", username);
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Update the travel job account to add the tourist's username to touristsNameItineraries
    const travelJobAccountUpdate = await travelJobAccount.findOneAndUpdate(
      { activitiesArray: activityName },
      { $addToSet: { touristsNameActivities: username } }, // Add to touristsNameActivities if not already present
      { new: true }
    );

    if (!travelJobAccountUpdate) {
      //console.error("Activity not found in travelJobAccounts:", activityName);
      return res
        .status(404)
        .json({ message: "Activity not found in travelJobAccounts" });
    }

    res.status(200).json({ message: "Activity booked successfully", tourist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book an itinerary
app.patch("/api/touristsAccounts/bookItinerary", async (req, res) => {
  try {
    const { username, itineraryName } = req.body;

    // Update the tourist's account with the booked itinerary
    const tourist = await touristAccount.findOneAndUpdate(
      { username },
      { $addToSet: { bookedItineraries: itineraryName } }, // Add to bookedItineraries if not already present
      { new: true }
    );

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Update the travel job account to add the tourist's username to touristsNameItineraries
    const travelJobAccountUpdate = await travelJobAccount.findOneAndUpdate(
      { itinerariesArray: itineraryName },
      { $addToSet: { touristsNameItineraries: username } }, // Add to touristsNameItineraries if not already present
      { new: true }
    );

    if (!travelJobAccountUpdate) {
      return res
        .status(404)
        .json({ message: "Itinerary not found in travelJobAccounts" });
    }

    res.status(200).json({ message: "Itinerary booked successfully", tourist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Cancel a booked itinerary
app.patch("/api/touristsAccounts/cancelBooking", async (req, res) => {
  try {
    const { username, itineraryName } = req.body;

    // Remove the itinerary from the tourist's booked list
    const tourist = await touristAccount.findOneAndUpdate(
      { username },
      { $pull: { bookedItineraries: itineraryName } }, // Remove from bookedItineraries
      { new: true }
    );

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Remove the tourist's username from the itinerary in travel job account
    const travelJobAccountUpdate = await travelJobAccount.findOneAndUpdate(
      { itinerariesArray: itineraryName },
      { $pull: { touristsNameItineraries: username } }, // Remove tourist from list
      { new: true }
    );

    if (!travelJobAccountUpdate) {
      return res
        .status(404)
        .json({ message: "Itinerary not found in travelJobAccounts" });
    }

    res.status(200).json({ message: "Booking canceled successfully", tourist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pay for an itinerary
app.patch("/api/touristsAccounts/payItinerary", async (req, res) => {
  try {
    const { username, itineraryName } = req.body;

    // Find the itinerary by name to get its price
    const itinerary = await Itinerary.findOne({ name: itineraryName });
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Fetch the tourist account
    const tourist = await touristAccount.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Calculate loyalty points based on badge level
    let pointsEarned = 0;
    if (tourist.badgeLevel.toLowerCase() === "bronze") {
      pointsEarned = itinerary.price * 0.5;
    } else if (tourist.badgeLevel.toLowerCase() === "silver") {
      pointsEarned = itinerary.price * 1;
    } else if (tourist.badgeLevel.toLowerCase() === "gold") {
      pointsEarned = itinerary.price * 1.5;
    }

    // Update tourist's paid itineraries and loyalty points
    let updatedLoyaltyPoints = tourist.loyaltyPoints + pointsEarned;
    let newBadgeLevel = tourist.badgeLevel;

    // Check and update badge level based on loyalty points
    if (updatedLoyaltyPoints > 500) {
      newBadgeLevel = "Gold";
    } else if (updatedLoyaltyPoints > 200) {
      newBadgeLevel = "Silver";
    } else {
      newBadgeLevel = "Bronze";
    }

    // Update the tourist's account with the paid itinerary and updated loyalty points
    const updatedTourist = await touristAccount.findOneAndUpdate(
      { username },
      {
        $addToSet: { paidItineraries: itineraryName }, // Add itinerary to paid list
        $inc: { loyaltyPoints: pointsEarned }, // Increment loyalty points
        $set: { badgeLevel: newBadgeLevel }, // Update badge level
      },
      { new: true }
    );

    // Update the travel job account to mark the itinerary as paid
    const travelJobAccountUpdate = await travelJobAccount.findOneAndUpdate(
      { itinerariesArray: itineraryName },
      { $set: { itineraryStatus: "paid" } }, // Mark itinerary as paid
      { new: true }
    );

    if (!travelJobAccountUpdate) {
      return res.status(404).json({ message: "Itinerary not found in travelJobAccounts" });
    }

    // Return success response
    res.status(200).json({
      message: "Itinerary paid successfully",
      tourist: updatedTourist,
      pointsEarned,
      newBadgeLevel,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.patch("/api/touristsAccounts/attendItinerary", async (req, res) => {
  try {
    const { username, itineraryName } = req.body;

    // Find the tourist account
    const tourist = await touristAccount.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Remove the itinerary from booked and paid itineraries if they exist
    tourist.bookedItineraries = tourist.bookedItineraries.filter(
      (itinerary) => itinerary !== itineraryName
    );
    tourist.paidItineraries = tourist.paidItineraries.filter(
      (itinerary) => itinerary !== itineraryName
    );

    // Add the itinerary to attended itineraries
    if (!tourist.attendedItineraries.includes(itineraryName)) {
      tourist.attendedItineraries.push(itineraryName);
    }

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({
      message: "Itinerary marked as attended successfully",
      attendedItineraries: tourist.attendedItineraries,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/touristsAccounts/payActivity", async (req, res) => {
  try {
    const { username, activityName, amountPaid } = req.body;

    // Find the activity by name to get its price
    const activity = await Activity.findOne({ activityName });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Fetch the tourist account
    const tourist = await touristAccount.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Calculate loyalty points based on badge level
    let pointsEarned = 0;
    if (tourist.badgeLevel.toLowerCase() === "bronze") {
      pointsEarned = activity.price * 0.5;
    } else if (tourist.badgeLevel.toLowerCase() === "silver") {
      pointsEarned = activity.price * 1;
    } else if (tourist.badgeLevel.toLowerCase() === "gold") {
      pointsEarned = activity.price * 1.5;
    }

    // Update tourist's paid activities and loyalty points
    let updatedLoyaltyPoints = tourist.loyaltyPoints + pointsEarned;
    let newBadgeLevel = tourist.badgeLevel;

    // Check and update badge level based on loyalty points
    if (updatedLoyaltyPoints > 500) {
      newBadgeLevel = "Gold";
    } else if (updatedLoyaltyPoints > 200) {
      newBadgeLevel = "Silver";
    } else {
      newBadgeLevel = "Bronze";
    }

    const updatedTourist = await touristAccount.findOneAndUpdate(
      { username },
      {
        $addToSet: { paidActivity: activityName }, // Add activity to paid list
        $inc: { loyaltyPoints: pointsEarned }, // Increment loyalty points
        $set: { badgeLevel: newBadgeLevel }, // Update badge level
      },
      { new: true }
    );

    // Update the travel job account to mark the activity as paid
    const travelJobAccountUpdate = await travelJobAccount.findOneAndUpdate(
      { activitiesArray: activityName },
      { $set: { activityStatus: "paid" } }, // Mark activity as paid
      { new: true }
    );

    if (!travelJobAccountUpdate) {
      return res
        .status(404)
        .json({ message: "Activity not found in travelJobAccounts" });
    }

    res.status(200).json({
      message: "Activity paid successfully",
      tourist: updatedTourist,
      pointsEarned,
      newBadgeLevel,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.patch("/api/touristsAccounts/attendActivity", async (req, res) => {
  try {
    const { username, activityName } = req.body;

    // Find the tourist account
    const tourist = await touristAccount.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Remove the activity from booked and paid activities if they exist
    tourist.bookedActivity = tourist.bookedActivity.filter(
      (activity) => activity !== activityName
    );
    tourist.paidActivity = tourist.paidActivity.filter(
      (activity) => activity !== activityName
    );

    // Add the activity to attended activities
    if (!tourist.attendedActivity.includes(activityName)) {
      tourist.attendedActivity.push(activityName);
    }

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({
      message: "Activity marked as attended successfully",
      attendedActivity: tourist.attendedActivity,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// const stripe = require("stripe")("your-secret-key"); // Use your Stripe secret key

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Create a PaymentIntent
// app.post("/api/stripe/create-payment-intent", async (req, res) => {
//   try {
//     const { amount } = req.body; // The amount should be in cents (e.g., $10 = 1000 cents)

//     // Create a PaymentIntent with the amount
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: "usd", // You can change the currency as needed
//       payment_method_types: ["card"],
//     });

//     // Send the client secret back to the frontend
//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     res.status(500).send({ error: "Payment creation failed." });
//   }
// });

// // Example: Start server
// app.listen(3501, () => {
//   console.log("Server running on port 3500");
// });
app.patch("/api/touristsAccounts/removeActivity", async (req, res) => {
  try {
    const { username, activityName } = req.body;

    const tourist = await touristAccount.findOneAndUpdate(
      { username },
      { $pull: { bookedActivity: activityName } },
      { new: true }
    );

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const travelJobAccountUpdate = await travelJobAccount.findOneAndUpdate(
      { activitiesArray: activityName },
      { $pull: { touristsNameActivities: username } },
      { new: true }
    );

    if (!travelJobAccountUpdate) {
      return res
        .status(404)
        .json({ message: "Activity not found in travelJobAccounts" });
    }

    res.status(200).json({ message: "Activity removed successfully", tourist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/travelJobsAccounts/:username/addActivity", async (req, res) => {
  try {
    const { username } = req.params;
    const { activityName } = req.body; // Get the activity name from the request body

    // Find the travel job account and push the activity name to the activitiesArray
    const account = await travelJobAccount.findOneAndUpdate(
      { username },
      { $push: { activitiesArray: activityName } }, // Add new activity to activitiesArray
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send back the updated account with the activities array
    res
      .status(200)
      .json({ message: "Activity added successfully", data: account });
  } catch (error) {
    //console.error("Error:", error); // Log error
    res.status(500).json({ error: error.message });
  }
});

//
//
//
app.patch(
  "/api/travelJobsAccounts/:username/addItinerary",
  async (req, res) => {
    try {
      const { username } = req.params;
      const { itineraryName } = req.body;

      const account = await travelJobAccount.findOneAndUpdate(
        { username },
        { $push: { itinerariesArray: itineraryName } },
        { new: true }
      );

      if (!account) {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.get("/api/deleteRequests", async (req, res) => {
  try {
    const requests = await DeleteRequest.find({});
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests." });
  }
});

app.delete("/api/deleteRequest/:username", async (req, res) => {
  const { username } = req.params;
  const { action } = req.body;

  try {
    if (action === "approve") {
      // Try deleting the user from both touristAccount and travelJobAccount
      const deletedTourist = await touristAccount.findOneAndDelete({
        username,
      });
      const deletedTravelJob = await travelJobAccount.findOneAndDelete({
        username,
      });

      // If neither account exists, return a 404 response
      if (!deletedTourist && !deletedTravelJob) {
        return res.status(404).json({ message: "User not found." });
      }

      // Remove the deletion request after account deletion
      await DeleteRequest.findOneAndDelete({ username });

      return res.status(200).json({
        message: `User ${username} deleted from ${
          deletedTourist ? "touristAccount" : "travelJobAccount"
        }.`,
      });
    } else if (action === "reject") {
      // Remove the deletion request without deleting the user
      await DeleteRequest.findOneAndDelete({ username });
      return res
        .status(200)
        .json({ message: `Request for ${username} rejected.` });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to process request." });
  }
});

app.post("/api/deleteRequest", async (req, res) => {
  const { username } = req.body;

  try {
    const newRequest = new DeleteRequest({ username });
    await newRequest.save();

    res.status(200).json({ message: "Delete request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit delete request" });
  }
});

app.post("/createAccount", async (req, res) => {
  const { username, password, accountType } = req.body;

  try {
    // Check if the username exists in any collection
    const userExistsInTourists = await touristAccount.findOne({ username });
    const userExistsInJobs = await travelJobAccount.findOne({ username });
    const userExistsInGovernors = await tourismGovernor.findOne({ username });
    const userExistsInAdmin = await admin.findOne({ username });

    if (
      userExistsInTourists ||
      userExistsInJobs ||
      userExistsInGovernors ||
      userExistsInAdmin
    ) {
      return res
        .status(400)
        .json({ message: "Username already exists in the system." });
    }

    // Create account based on accountType
    if (accountType === "admin") {
      const newAdmin = new admin({ username, password });
      await newAdmin.save();
      res.status(200).json({ message: "Admin account created successfully." });
    } else if (accountType === "tourismGovernor") {
      const newGovernor = new tourismGovernor({ username, password });
      await newGovernor.save();
      res
        .status(200)
        .json({ message: "Tourism Governor account created successfully." });
    } else {
      res.status(400).json({ message: "Invalid account type." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating account." });
  }
});

app.delete("/api/adminDelete/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Check and delete from travelJobsAccounts collection
    let deletedAccount = await travelJobAccount.findOneAndDelete({ username });

    // If not found in travelJobsAccounts, check and delete from tourist collection
    if (!deletedAccount) {
      deletedAccount = await touristAccount.findOneAndDelete({ username });
    }

    // If not found in tourist, check and delete from tourismGoverner collection
    if (!deletedAccount) {
      deletedAccount = await tourismGoverner.findOneAndDelete({ username });
    }

    // If not found in tourismGoverner, check and delete from admin collection
    if (!deletedAccount) {
      deletedAccount = await admin.findOneAndDelete({ username });
    }

    // If account found and deleted
    if (deletedAccount) {
      res.status(200).json({
        message: `Account with username "${username}" has been deleted.`,
      });
    } else {
      // If no account found in any collection
      res.status(404).json({ message: "Account not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while deleting the account." });
  }
});

app.get("/api/travelJobsAccounts/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// module.exports = router;

app.use(express.json());

app.use("/api/activities", activityRoutes);

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save documents in 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file names
  },
});

const upload = multer({ storage: storage });

app.get("/admin/documents", async (req, res) => {
  try {
    const usersWithDocuments = await travelJobAccount.find(
      { documentUploaded: true, accepted: false },
      "username type documentPath"
    );

    if (!usersWithDocuments.length) {
      return res
        .status(200)
        .json({ message: "No pending users with documents." });
    }

    res.status(200).json(usersWithDocuments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents." });
  }
});

app.post("/api/uploadDocument", upload.single("document"), async (req, res) => {
  try {
    const { username } = req.body;
    const user = await travelJobAccount.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.documentPath = req.file.path; // Save the document's file path
    user.documentUploaded = true;
    //user.document = req.file.filename; // Save the document name in the user's profile
    await user.save();

    res.status(200).json({ message: "Document uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/getPendingUsers", async (req, res) => {
  try {
    const pendingUsers = await travelJobAccount.find({
      accepted: false,
      document: { $exists: true },
    });
    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/updateUserStatus", async (req, res) => {
  const { username, accepted } = req.body;

  try {
    const user = await travelJobAccount.findOneAndUpdate(
      { username },
      { accepted },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: `User ${accepted ? "accepted" : "rejected"} successfully!`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for the tourist account
    let user = await touristAccount.findOne({ username });

    // Check for the job account if tourist not found
    if (!user) {
      user = await travelJobAccount.findOne({ username });
    }
    if (!user) {
      user = await admin.findOne({ username });
    }
    if (!user) {
      user = await tourismGovernor.findOne({ username });
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "Username or password is incorrect." });
    }

    // Verify the password
    if (user.password !== password) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect." });
    }

    // Redirect logic based on type and accepted status

    if (user.type === "tourist") {
      return res.status(200).json({ redirect: "/tourist-page" });
    }
    if (user.type === "admin") {
      return res.status(200).json({ redirect: "/admin-main" });
    }
    if (user.type === "tourismGoverner") {
      return res.status(200).json({ redirect: "/tourism-governor" });
    } else if (
      user.type === "advertiser" ||
      user.type === "seller" ||
      user.type === "tour guide"
    ) {
      if (user.accepted) {
        const redirectPage =
          user.type === "advertiser"
            ? "advertiser-main"
            : user.type === "seller"
            ? "seller-main" // Assuming this is correct based on your structure
            : "tour-guide-main";
        return res.status(200).json({ redirect: redirectPage });
      } else {
        return res.status(200).json({ redirect: "not-accepted" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password endpoint for both tourists and jobs
app.post("/api/changePassword", async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  try {
    // Find the user in the tourist or job accounts
    const tourist = await touristAccount.findOne({ username });
    const jobAccount = await travelJobAccount.findOne({ username });

    let account;

    if (tourist) {
      account = tourist;
    } else if (jobAccount) {
      account = jobAccount;
    } else {
      return res.status(400).json({ message: "Username not found." });
    }

    // Check if old password matches
    if (account.password !== oldPassword) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // Update password
    account.password = newPassword;
    await account.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/touristsAccounts", async (req, res) => {
  try {
    const { email, username } = req.body;

    // Check if the email or username already exists
    const existingAccount = await touristAccount.findOne({
      $or: [{ email: email }, { username: username }],
    });
    const otherExistingAccount = await travelJobAccount.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingAccount) {
      // If email or username exists, notify the user
      return res.status(400).json({
        message:
          existingAccount.email === email
            ? "Email is already in use."
            : "Username is already taken.",
      });
    } else if (otherExistingAccount) {
      // If email or username exists, notify the user
      return res.status(400).json({
        message:
          otherExistingAccount.email === email
            ? "Email is already in use."
            : "Username is already taken.",
      });
    }

    // If no duplicates, create the account
    const newTouristAccount = await touristAccount.create({
      ...req.body,
      type: "tourist", // Explicitly set type to "tourist" for clarity
    });
    res
      .status(201)
      .json({ message: "Registration successful", data: newTouristAccount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/travelJobsAccounts", async (req, res) => {
  try {
    const { email, username } = req.body;

    // Check if the email or username already exists
    const existingAccount = await touristAccount.findOne({
      $or: [{ email: email }, { username: username }],
    });
    const otherExistingAccount = await travelJobAccount.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingAccount) {
      // If email or username exists, notify the user
      return res.status(400).json({
        message:
          existingAccount.email === email
            ? "Email is already in use."
            : "Username is already taken.",
      });
    } else if (otherExistingAccount) {
      // If email or username exists, notify the user
      return res.status(400).json({
        message:
          otherExistingAccount.email === email
            ? "Email is already in use."
            : "Username is already taken.",
      });
    }

    // If no duplicates, create the account
    const newJobAccount = await travelJobAccount.create({
      ...req.body,
      accepted: false,
    });
    res
      .status(201)
      .json({ message: "Registration successful", data: newJobAccount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch tour guide profile
app.get("/api/travelJobsAccounts", async (req, res) => {
  try {
    // Assuming the user is already authenticated, replace with proper user identification
    const tourGuide = await travelJobAccount.findOne({ email: req.user.email });
    if (!tourGuide) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(tourGuide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update tour guide profile

app.get("/api/touristsAccounts/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const account = await Account1.findOne({ username });
    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/touristsAccounts/:username", async (req, res) => {
  try {
    const { username } = req.params; // Fetching the username from params
    const { job, nationality, mobile_Number } = req.body; // Fetching possible updated fields

    // Fetch the user to check their type
    const account = await touristAccount.findOne({ username });

    if (!account) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Initialize an empty update object
    let updateFields = {};

    // Update based on the type of user

    updateFields = { job, nationality, mobile_Number };

    // Remove undefined fields from the update object
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });

    // Perform the update
    const updatedProfile = await touristAccount.findOneAndUpdate(
      { username }, // Using the username to find the account
      updateFields, // Updating the relevant fields
      { new: true } // Return the updated document
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(updatedProfile); // Respond with the updated profile
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/travelJobsAccounts/:username", async (req, res) => {
  try {
    const { username } = req.params; // Fetching the username from params
    const {
      mobile,
      yearsOfExperience,
      previousWork,
      website,
      hotline,
      companyProfile,
      name,
      description,
    } = req.body; // Fetching possible updated fields

    // Fetch the user to check their type
    const account = await travelJobAccount.findOne({ username });

    if (!account) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Initialize an empty update object
    let updateFields = {};

    // Update based on the type of user
    if (account.type === "tour guide") {
      updateFields = { mobile, yearsOfExperience, previousWork };
    } else if (account.type === "advertiser") {
      updateFields = { website, hotline, companyProfile };
    } else if (account.type === "seller") {
      updateFields = { name, description };
    }

    // Remove undefined fields from the update object
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });

    // Perform the update
    const updatedProfile = await travelJobAccount.findOneAndUpdate(
      { username }, // Using the username to find the account
      updateFields, // Updating the relevant fields
      { new: true } // Return the updated document
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(updatedProfile); // Respond with the updated profile
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose
  .connect(
    "mongodb+srv://kerollosashraf:nVKS4okSQeUz3c3Q@travelme.rnuai.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB", error);
  });
