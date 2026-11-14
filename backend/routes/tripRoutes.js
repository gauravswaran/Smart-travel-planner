const express = require("express");
const router = express.Router();

const Trip = require("../models/Trip");

console.log("TRIP ROUTES FILE LOADED");

// POST API - Create New Trip
router.post("/", async (req, res) => {
  console.log("STEP 1: POST received");

  try {
    const { destination, travelDate, travelers, budget } = req.body;

    const newTrip = new Trip({
      destination,
      travelDate,
      travelers,
      budget
    });

    console.log("STEP 2: Saving trip");

    const savedTrip = await newTrip.save();

    console.log("STEP 3: Trip saved successfully");

    res.status(201).json({
      message: "Trip saved successfully!",
      trip: savedTrip
    });

  } catch (error) {
    console.log("SAVE ERROR:", error.message);

    res.status(500).json({
      message: "Error saving trip",
      error: error.message
    });
  }
});

// GET API - Get All Trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.status(200).json(trips);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching trips",
      error: error.message
    });
  }
});

// PUT API - Update Trip
router.put("/:id", async (req, res) => {
  console.log("PUT API HIT");

  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
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

// DELETE API
router.delete("/:id", async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);

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
      message: error.message
    });
  }
});

module.exports = router;