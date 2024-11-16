//booking.routes.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/booking.model.js");

// Create a new booking (for available options)
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ message: "Booking option created successfully", data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all available bookings
router.get("/available", async (req, res) => {
  try {
    const bookings = await Booking.find({ isBooked: false });
    res.status(200).json({ data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book a transportation option for a tourist
router.post("/book/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const touristId = req.body.touristId;

    // Find the booking and check if it's already booked
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.isBooked) {
      return res.status(400).json({ message: "This booking is already reserved." });
    }

    // Update booking to mark it as booked and assign it to the tourist
    booking.isBooked = true;
    booking.touristId = touristId;
    await booking.save();

    res.status(200).json({ message: "Booking reserved successfully", data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings for a specific tourist
router.get("/my-bookings/:touristId", async (req, res) => {
  try {
    const touristBookings = await Booking.find({ touristId: req.params.touristId });
    res.status(200).json({ data: touristBookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a booking option (admin only or for managing available options)
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking option deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
