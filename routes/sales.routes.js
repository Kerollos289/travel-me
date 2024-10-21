//sales.routes.js
const express = require("express");
const router = express.Router();
const Sales = require("../models/sales.model");

// Create a new sale
router.post("/create", async (req, res) => {
  try {
    const { name, type, revenue } = req.body;

    // Create a new sales entry
    const newSale = new Sales({
      name,
      type,
      revenue,
    });

    await newSale.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ message: "Error creating sale", error });
  }
});

// Get all sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sales.find();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error });
  }
});

// Get a single sale by ID
router.get("/:id", async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sale", error });
  }
});

// Update a sale
router.put("/:id", async (req, res) => {
  try {
    const { name, type, revenue } = req.body;

    const updatedSale = await Sales.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        revenue,
        appRate: revenue * 0.1, // Recalculate the app rate
      },
      { new: true }
    );

    if (!updatedSale) return res.status(404).json({ message: "Sale not found" });

    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(500).json({ message: "Error updating sale", error });
  }
});

// Delete a sale
router.delete("/:id", async (req, res) => {
  try {
    const deletedSale = await Sales.findByIdAndDelete(req.params.id);
    if (!deletedSale) return res.status(404).json({ message: "Sale not found" });

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sale", error });
  }
});
// Generate sales report
router.get("/report", async (req, res) => {
    try {
      const sales = await Sales.find();
  
      const totalRevenue = sales.reduce((acc, sale) => acc + sale.revenue, 0); // Total revenue
      const totalAppRate = totalRevenue * 0.1; // 10% of the total revenue
  
      // Send back the total revenue and app rate
      res.json({
        totalRevenue: totalRevenue.toFixed(2),
        totalAppRate: totalAppRate.toFixed(2),
      });
    } catch (error) {
      res.status(500).json({ message: "Error generating sales report", error });
    }
  });
  
  

module.exports = router;