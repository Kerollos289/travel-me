//applyPromo.routes.js
const express = require("express");
const router = express.Router();
const PromoCode = require("../models/promoCodes.model.js");
const touristAccount = require("../models/touristsAccounts.models.js");

// Endpoint to apply a promo code and update wallet balance
router.post("/", async (req, res) => {
  const { email, promoCode } = req.body;

  try {
    // Find the promo code from the database
    const promo = await PromoCode.findOne({ code: promoCode });
    
    if (!promo) {
      return res.status(404).json({ message: "Invalid promo code" });
    }

    // Find the tourist account by email
    const tourist = await touristAccount.findOne({ email: email });
    
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Add the promo code value to the tourist's wallet
    tourist.wallet += promo.value;

    // Save the updated tourist account
    await tourist.save();

    return res.status(200).json({
      message: `Promo code applied successfully! ${promo.value} has been added to your wallet.`,
      wallet: tourist.wallet,
    });
  } catch (error) {
    console.error("Error applying promo code:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
