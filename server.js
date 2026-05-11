import express from "express";
import dotenv from "dotenv";

import gamesRoutes from "./routes/games.js";
import historyRoutes from "./routes/history.js";

import db from "./services/db.js";

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB Atlas
await db.connect();

// Routes
app.use("/games", gamesRoutes);
app.use("/history", historyRoutes);

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "FreeToGame API Server Running"
    });
});

// Port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
