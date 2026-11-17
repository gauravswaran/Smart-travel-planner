import mongoose from "mongoose";
import Trip from "../../backend/models/Trip.js";

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) return;

  cachedConnection = mongoose.connect(process.env.MONGODB_URI);
  await cachedConnection;
}

export default async function handler(req, res) {
  try {
    await connectDB();

    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid trip ID"
      });
    }

    if (req.method === "PUT") {
      const updatedTrip = await Trip.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedTrip) {
        return res.status(404).json({
          message: "Trip not found"
        });
      }

      return res.status(200).json(updatedTrip);
    }

    if (req.method === "DELETE") {
      const deletedTrip = await Trip.findByIdAndDelete(id);

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
    cachedConnection = null;

    return res.status(500).json({
      message: error.message
    });
  }
}