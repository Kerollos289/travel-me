// activity.routes.js
const express = require("express");
const router = express.Router();
const Activity = require("../models/activity.model.js"); // Ensure the path is correct based on your folder structure
const travelJobAccount = require("../models/travelJobsAccounts.models.js");

// Create a new activity
router.post("/", async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res
      .status(201)
      .json({ message: "Activity created successfully", data: activity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/flagged-activities/:username", async (req, res) => {
  try {
    const user = await travelJobAccount.findOne({
      username: req.params.username,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const flaggedActivities = await Activity.find({
      activityName: { $in: user.activitiesArray },
      isFlagged: true,
      notificationClosed: false,
    });

    res.status(200).json(flaggedActivities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Close notification for a flagged itinerary
router.patch("/close-notification/:id", async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { notificationClosed: true },
      { new: true }
    );
    if (!activity) {
      return res.status(404).json({ message: "activity not found" });
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/admin", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json({ data: activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find({ isFlagged: { $ne: true } });
    res.status(200).json({ data: activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an activity
router.put("/:id", async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "Activity updated successfully",
      data: updatedActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete an activity
router.delete("/:id", async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
