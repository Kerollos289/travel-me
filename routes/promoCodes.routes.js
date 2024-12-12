//promoCodes.routes.js
const express = require("express");
const router = express.Router();
const PromoCode = require("../models/promoCodes.model.js");

// Create a new Promo Code
router.post("/", async (req, res) => {
  try {
    const promoCode = await PromoCode.create(req.body);
    res.status(201).json({
      message: "Promo Code created successfully",
      data: promoCode,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all Promo Codes
router.get("/", async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json({ data: promoCodes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a Promo Code by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedPromoCode = await PromoCode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Promo Code updated successfully",
      data: updatedPromoCode,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a Promo Code by ID
router.delete("/:id", async (req, res) => {
  try {
    await PromoCode.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Promo Code deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
