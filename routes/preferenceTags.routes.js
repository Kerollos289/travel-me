const express = require("express");
const router = express.Router();
const PreferenceTag = require("../models/preferenceTags.model.js");

router.post("/", async (req, res) => {
    try {
      const preferenceTag = await PreferenceTag.create(req.body);
      res.status(201).json({ message: "Preference Tag created successfully", data: preferenceTag });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get("/", async (req, res) => {
    try {
      const preferenceTags = await PreferenceTag.find();
      res.status(200).json({ data: preferenceTags });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.put("/:id", async (req, res) => {
    try {
      const updatedpreferenceTag = await PreferenceTag.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json({ message: "Preference Tag updated successfully", data: updatedpreferenceTag });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.delete("/:id", async (req, res) => {
    try {
      await PreferenceTag.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Preference Tag deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;