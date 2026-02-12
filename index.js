// index.js
import dotenv from "dotenv";
dotenv.config(); // load .env variables

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

// ROUTES
import userRouter from "./routers/userRouter.js";

// MODELS
import User from "./models/user.js";

// ROUTERS (Import)
import measurementRouter from "./routers/measurementRouter.js";
import availabilityRouter from "./routers/availabilityRouter.js";
import appointmentRouter from "./routers/appointmentRouter.js";
import productRouter from "./routers/product.js";

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// APP
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Main routes
app.use("/users", userRouter);
app.use("/measurements", measurementRouter);
app.use("/availability", availabilityRouter);
app.use("/appointments", appointmentRouter);
app.use("/products", productRouter);

// MongoDB connection & server start
// MongoDB connection & server start
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    // console.log(`URI: ${process.env.MONGO_URI.split('@')[1]}`); 

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
      family: 4, 
    });

    console.log("✔ MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✔ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    if (error.code === 'ENOTFOUND') {
      console.error("---------------------------------------------------");
      console.error("Error: DNS Lookup Failed (ENOTFOUND)");
      console.error("---------------------------------------------------");
      console.error("1. Check your internet connection.");
      console.error("2. If using a VPN, one might be blocking DNS.");
      console.error("3. Update your Adapter settings to use 8.8.8.8.");
      console.error("---------------------------------------------------");
    } else {
      console.error("Error details:", error.message);
    }
  }
};

startServer();
