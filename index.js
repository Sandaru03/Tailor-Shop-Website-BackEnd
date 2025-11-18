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

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// APP
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//JWT Middleware

app.use(async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  const value = req.header("Authorization");
  if (!value) return next();

  const token = value.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId && decoded.email) {
      try {
        const u = await User.findOne({ email: decoded.email })
          .select("_id role isBlock isEmailVerified image")
          .lean();
        if (!u) {
          return res.status(401).json({ message: "Unauthorized: user not found" });
        }
        decoded.userId = u._id.toString();
        // optional refresh
        decoded.role = u.role ?? decoded.role;
        decoded.isBlock = u.isBlock ?? decoded.isBlock;
        decoded.isEmailVerified = u.isEmailVerified ?? decoded.isEmailVerified;
        decoded.image = u.image ?? decoded.image;
      } catch (lookupErr) {
        console.error("Auth user lookup failed:", lookupErr.message);
        return res.status(500).json({ message: "Auth lookup failed" });
      }
    }

    req.user = decoded;
    // console.log("Decoded token (ensured userId):", req.user);
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
});

// Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// Main routes
app.use("/users", userRouter);

// MongoDB connection & server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✔ MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✔ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed", error.message);
    process.exit(1);
  }
};

startServer();
