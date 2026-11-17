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

    if (req.method === "GET") {
      const trips = await Trip.find().sort({ createdAt: -1 });
      return res.status(200).json(trips);
    }

    if (req.method === "POST") {
      const trip = await Trip.create(req.body);

      return res.status(201).json({
        message: "Trip saved successfully!",
        trip
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