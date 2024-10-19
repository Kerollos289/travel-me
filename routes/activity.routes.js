// activity.routes.js
const express = require("express");
const router = express.Router();
const Activity = require("../models/activity.model.js"); // Ensure the path is correct based on your folder structure

// Create a new activity
router.post("/", async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json({ message: "Activity created successfully", data: activity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json({ data: activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an activity
router.put("/:id", async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Activity updated successfully", data: updatedActivity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an activity
router.delete("/:id", async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
