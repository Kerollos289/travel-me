// guestSales.routes.js
const express = require("express");
const router = express.Router();
const GuestSales = require("../models/guestSales.model");

// Get all guest sales or filter by name and month
router.get("/", async (req, res) => {
  try {
    const { name, month } = req.query;
    let query = {};

    // Filter by name if provided
    if (name) {
      query.name = new RegExp(name, 'i'); // Case-insensitive search
    }

    // Filter by month if provided
    if (month) {
      query.month = parseInt(month); // Ensure the month is a number
    }

    const guestSales = await GuestSales.find(query);
    res.status(200).json(guestSales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching guest sales", error });
  }
});

// Get all guest sales
router.get("/", async (req, res) => {
  try {
    const guestSales = await GuestSales.find();
    res.status(200).json(guestSales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching guest sales", error });
  }
});

// Get a single guest sale by ID
router.get("/:id", async (req, res) => {
  try {
    const guestSale = await GuestSales.findById(req.params.id);
    if (!guestSale) return res.status(404).json({ message: "Guest sale not found" });
    res.status(200).json(guestSale);
  } catch (error) {
    res.status(500).json({ message: "Error fetching guest sale", error });
  }
});

// Update a guest sale
router.put("/:id", async (req, res) => {
  try {
    const { name, revenue } = req.body;

    const updatedGuestSale = await GuestSales.findByIdAndUpdate(
      req.params.id,
      {
        name,
        revenue,
        myRate: revenue * 0.9, // Recalculate the myRate
      },
      { new: true }
    );

    if (!updatedGuestSale) return res.status(404).json({ message: "Guest sale not found" });

    res.status(200).json(updatedGuestSale);
  } catch (error) {
    res.status(500).json({ message: "Error updating guest sale", error });
  }
});

// Delete a guest sale
router.delete("/:id", async (req, res) => {
  try {
    const deletedGuestSale = await GuestSales.findByIdAndDelete(req.params.id);
    if (!deletedGuestSale) return res.status(404).json({ message: "Guest sale not found" });

    res.status(200).json({ message: "Guest sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting guest sale", error });
  }
});

// Create a new guest sale
router.post("/create", async (req, res) => {
  try {
    const { name, revenue, date } = req.body;

    // Create a new guest sales entry
    const newGuestSale = new GuestSales({
      name,
      revenue,
      date,
    });

    await newGuestSale.save();
    res.status(201).json(newGuestSale);
  } catch (error) {
    res.status(500).json({ message: "Error creating guest sale", error });
  }
});

// Get all guest sales with optional filters (name, month)
router.get("/", async (req, res) => {
  try {
    const { name, month } = req.query;

    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }

    if (month) {
      query.month = parseInt(month);
    }

    const guestSales = await GuestSales.find(query);
    res.status(200).json(guestSales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching guest sales", error });
  }
});



module.exports = router;