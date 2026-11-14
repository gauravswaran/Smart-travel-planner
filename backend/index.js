const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.originalUrl);
    next();
});
// Import Trip Routes
const tripRoutes = require("./routes/tripRoutes");

// Home Route
app.get("/", (req, res) => {
    res.send("Smart Travel Planner Backend is Running!");
});

// Connect Trip Routes
app.use("/api/trips", tripRoutes);

// MongoDB Connection and Server Start
const PORT =  5001;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });