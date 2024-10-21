const express = require("express");
const router = express.Router();
const ActivityCategory = require("../models/activityCategory.model.js");

router.post("/", async (req, res) => {
    try {
      const activityCategory = await ActivityCategory.create(req.body);
      res.status(201).json({ message: "Activity Category created successfully", data: activityCategory });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get("/", async (req, res) => {
    try {
      const activitiesCategories = await ActivityCategory.find();
      res.status(200).json({ data: activitiesCategories });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.put("/:id", async (req, res) => {
    try {
      const updatedActivityCategory = await ActivityCategory.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json({ message: "Activity Category updated successfully", data: updatedActivityCategory });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.delete("/:id", async (req, res) => {
    try {
      await ActivityCategory.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Activity Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
  