//reqPromo.routes.js
const express = require("express");
const router = express.Router();
const PromoCode = require("../models/promoCodes.model.js"); // PromoCode model

// Endpoint for tourists to get a random promo code
router.get("/", async (req, res) => {
    try {
        const promoCodes = await PromoCode.find();
        
        // Check if there are any promo codes
        if (promoCodes.length === 0) {
          return res.status(404).json({ message: "No promo codes available" });
        }
    
        // Select a random promo code from the array
        const randomPromoCode = promoCodes[Math.floor(Math.random() * promoCodes.length)];
    
        res.status(200).json({ data: randomPromoCode });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

module.exports = router;
