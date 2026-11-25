import mongoose from "mongoose";
import Trip from "../../backend/models/Trip.js";
import { authenticate } from "../_utils/auth.js";

let cachedConnection = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  if (!cachedConnection) {
    cachedConnection = mongoose.connect(process.env.MONGODB_URI);
  }

  await cachedConnection;
}

export default async function handler(req, res) {
  const userId = authenticate(req, res);

  if (!userId) return;

  try {
    await connectDB();

    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid trip ID"
      });
    }

    if (req.method === "PUT") {
      const { destination, travelDate, travelers, budget } = req.body;

      const updatedTrip = await Trip.findOneAndUpdate(
        { _id: id, user: userId },
        { destination, travelDate, travelers, budget },
        { new: true, runValidators: true }
      );

      if (!updatedTrip) {
        return res.status(404).json({
          message: "Trip not found"
        });
      }

      return res.status(200).json({
        message: "Trip updated successfully!",
        trip: updatedTrip
      });
    }

    if (req.method === "DELETE") {
      const deletedTrip = await Trip.findOneAndDelete({
        _id: id,
        user: userId
      });

      if (!deletedTrip) {
        return res.status(404).json({
          message: "Trip not found"
        });
      }

      return res.status(200).json({
        message: "Trip deleted successfully!"
      });
    }

    return res.status(405).json({
      message: "Method not allowed"
    });

  } catch (error) {
    console.error("Trip API error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
}