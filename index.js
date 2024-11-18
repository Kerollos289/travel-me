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

// app.get(
//   "/api/travelJobsAccounts/TourGuideReport/:username",
//   async (req, res) => {
//     try {
//       const username = req.params.username; // Extract from path parameters
//       if (!username) {
//         return res.status(400).send("Username is required");
//       }

//       const tourGuide = await travelJobAccount.findOne({ username });
//       if (!tourGuide) {
//         return res.status(404).send("Tour Guide not found");
//       }

//       const itinerariesArray = tourGuide.itinerariesArray;
//       let report = {};

//       for (let itinerary of itinerariesArray) {
//         // Check if the activity exists in the database
//         const tourists = await touristAccount.find({
//           bookedItineraries: itinerary,
//         });
//         if (tourists.length > 0) {
//           report[itinerary] = tourists.length; // Only include activities with bookings
//         }
//       }

//       res.status(200).json(report); // Send the filtered report
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Server error");
//     }
//   }
// );

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
