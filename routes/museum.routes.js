//museum.routes.js
const express = require('express');
const router = express.Router();
const Museum = require('../models/museum.model');

// Create a new museum
router.post('/', async (req, res) => {
  try {
    const newMuseum = new Museum(req.body);
    const savedMuseum = await newMuseum.save();
    res.status(201).json(savedMuseum);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read all museums
router.get('/', async (req, res) => {
  try {
    const museums = await Museum.find();
    res.status(200).json(museums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read a single museum by ID
router.get('/:id', async (req, res) => {
  try {
    const museum = await Museum.findById(req.params.id);
    if (!museum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(200).json(museum);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a museum by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedMuseum = await Museum.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMuseum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(200).json(updatedMuseum);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a museum by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedMuseum = await Museum.findByIdAndDelete(req.params.id);
    if (!deletedMuseum) {
      return res.status(404).json({ message: "Museum not found" });
    }
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;