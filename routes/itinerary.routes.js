// itinerary.routes.js
const express = require("express");
const router = express.Router();
const Itinerary = require("../models/itinerary.model.js");

// Create a new itinerary
router.post("/", async (req, res) => {
  try {
    const newItinerary = await Itinerary.create(req.body);
    res.status(201).json(newItinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read all itineraries
router.get("/", async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read a single itinerary by ID
router.get("/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an itinerary by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.status(200).json(updatedItinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an itinerary by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!deletedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read all itineraries with filtering and sorting
router.get("/", async (req, res) => {
  try {
    const { price, date, language, preferences, sortBy } = req.query;

    // Build the filter object
    const filter = {};
    if (price) filter.price = { $lte: price };
    if (date) filter.availableDates = { $in: [date] };
    if (language) filter.language = language;
    if (preferences) filter.activities = { $regex: preferences, $options: "i" }; // case-insensitive match

    // Build the sort object
    const sort = {};
    if (sortBy) {
      const [field, order] = sortBy.split('_');
      sort[field] = order === 'desc' ? -1 : 1;
    }

    const itineraries = await Itinerary.find(filter).sort(sort);
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;