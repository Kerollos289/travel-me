//index.js
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const mongoose = require("mongoose");
const touristAccount = require("./models/touristsAccounts.models.js");
const travelJobAccount = require("./models/travelJobsAccounts.models.js");
const itineraryRoutes = require("./routes/itinerary.routes.js");
const museumRoutes = require('./routes/museum.routes.js'); //
const activityCategoryRoutes= require('./routes/activityCategory.routes.js');
const preferenceTagsRoutes= require('./routes/preferenceTags.routes.js');


// Import the activity routes
const activityRoutes = require("./routes/activity.routes.js");


const PORT = process.env.PORT || 3500;

app.use(express.json());

app.use("/api/activities", activityRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use('/api/museums', museumRoutes);
app.use("/api/activityCategory", activityCategoryRoutes);
app.use("/api/preferenceTags", preferenceTagsRoutes);

// Login endpoint for both tourists and jobs
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
      return res.status(200).json({ redirect: "touristPage.js" });
    } else if (
      user.type === "advertiser" ||
      user.type === "seller" ||
      user.type === "tour guide"
    ) {
      if (user.accepted) {
        const redirectPage =
          user.type === "advertiser"
            ? "AdvertiserPage.js"
            : user.type === "seller"
            ? "SellerPage.js"
            : "TourGuidePage.js";
        return res.status(200).json({ redirect: redirectPage });
      } else {
        return res.status(200).json({ redirect: "notAccepted.js" });
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
app.put("/api/travelJobsAccounts", async (req, res) => {
  try {
    const { mobile, yearsOfExperience, previousWork } = req.body;
    const updatedProfile = await travelJobAccount.findOneAndUpdate(
      { email: req.user.email }, // Assuming authentication
      { mobile, yearsOfExperience, previousWork },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(updatedProfile);
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
