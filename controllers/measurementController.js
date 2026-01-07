import Measurement from "../models/measurement.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/measurements";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

export const createMeasurement = async (req, res) => {
  try {
    const { name, phone, neck, shoulder, chest, waist, hips, sleeve, frontLength, backLength } = req.body;
    
    // Get file paths if they exist
    const videoFront = req.files['videoFront'] ? req.files['videoFront'][0].path.replace(/\\/g, "/") : null;
    const videoBack = req.files['videoBack'] ? req.files['videoBack'][0].path.replace(/\\/g, "/") : null;

    const newMeasurement = new Measurement({
      name,
      phone,
      measurements: {
        neck, shoulder, chest, waist, hips, sleeve, frontLength, backLength
      },
      videoFront,
      videoBack
    });

    await newMeasurement.save();
    res.status(201).json({ message: "Measurement submitted successfully!", data: newMeasurement });
  } catch (error) {
    console.error("Error submitting measurement:", error);
    res.status(500).json({ message: "Server error during submission" });
  }
};

export const getMeasurements = async (req, res) => {
  try {
    const measurements = await Measurement.find().sort({ createdAt: -1 });
    res.status(200).json(measurements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch measurements" });
  }
};

export const deleteMeasurement = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Measurement.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Measurement not found" });
        
        // Optionally delete files from disk here
        
        res.status(200).json({ message: "Measurement deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete" });
    }
}
