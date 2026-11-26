import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../../backend/models/User.js";

let cachedConnection = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  if (!cachedConnection) {
    cachedConnection = mongoose.connect(process.env.MONGODB_URI);
  }

  await cachedConnection;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {
    await connectDB();

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: cleanEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Registration successful!"
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed"
    });
  }
}