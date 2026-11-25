const express = require("express");
const router = express.Router();

const Trip = require("../models/Trip");
const authMiddleware = require("../Middlewere/AuthMiddlewere");

console.log("TRIP ROUTES FILE LOADED");

// Protect all trip routes
router.use(authMiddleware);

// POST API - Create New Trip
router.post("/", async (req, res) => {
  try {
    const { destination, travelDate, travelers, budget } = req.body;

    const newTrip = new Trip({
      destination,
      travelDate,
      travelers,
      budget,
      user: req.userId
    });

    const savedTrip = await newTrip.save();

    res.status(201).json({
      message: "Trip saved successfully!",
      trip: savedTrip
    });

  } catch (error) {
    res.status(500).json({
      message: "Error saving trip",
      error: error.message
    });
  }
});

// GET API - Get Logged-in User's Trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.userId });
    res.status(200).json(trips);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching trips",
      error: error.message
    });
  }
});

// PUT API - Update Own Trip
router.put("/:id", async (req, res) => {
  try {
    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    res.json({
      message: "Trip updated successfully!",
      trip: updatedTrip
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating trip",
      error: error.message
    });
  }
});

// DELETE API - Delete Own Trip
router.delete("/:id", async (req, res) => {
  try {
    const deletedTrip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!deletedTrip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    res.json({
      message: "Trip deleted successfully!"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting trip",
      error: error.message
    });
  }
});

module.exports = router;