// index.js
import dotenv from "dotenv";
dotenv.config(); // load .env variables

import express from "express";
import cors from "cors";

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
// MySQL connection & server start
import { connectDB, sequelize } from './config/db.js';

const startServer = async () => {
    try {
        await connectDB();
        
        // Sync models (optional: use { force: true } to recreate tables, but be careful with data loss! Use { alter: true } for updates)
        // For production, use migrations. For now, valid for dev.
        await sequelize.sync({ alter: true }); 
        console.log("✔ MySQL synchronized");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`✔ Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Database Connection Failed", error);
    }
};

startServer();
