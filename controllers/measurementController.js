import Measurement from "../models/measurement.js";
import multer from "multer";
import path from "path";
import { supabase } from "../config/supabase.js";

// Configure Multer to use Memory Storage
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

const uploadToSupabase = async (file) => {
    if (!supabase) {
        throw new Error("Supabase is not configured. Check environment variables.");
    }

    const timestamp = Date.now();
    const fileName = `${file.fieldname}-${timestamp}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    
    const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) {
        throw new Error(`Supabase Upload Error: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);
        
    return publicUrlData.publicUrl;
};

export const createMeasurement = async (req, res) => {
  try {
    const { name, phone, neck, shoulder, chest, waist, hips, sleeve, frontLength, backLength } = req.body;
    
    let videoFrontUrl = null;
    let videoBackUrl = null;

    // Upload Video Front
    if (req.files['videoFront'] && req.files['videoFront'][0]) {
        try {
            videoFrontUrl = await uploadToSupabase(req.files['videoFront'][0]);
        } catch (uploadError) {
            console.error("Error uploading front video:", uploadError);
            return res.status(500).json({ message: "Failed to upload front video" });
        }
    }

    // Upload Video Back
    if (req.files['videoBack'] && req.files['videoBack'][0]) {
        try {
            videoBackUrl = await uploadToSupabase(req.files['videoBack'][0]);
        } catch (uploadError) {
            console.error("Error uploading back video:", uploadError);
            return res.status(500).json({ message: "Failed to upload back video" });
        }
    }

    const newMeasurement = new Measurement({
      name,
      phone,
      measurements: {
        neck, shoulder, chest, waist, hips, sleeve, frontLength, backLength
      },
      videoFront: videoFrontUrl,
      videoBack: videoBackUrl
    });

    await newMeasurement.save();
    res.status(201).json({ message: "Measurement submitted successfully!", data: newMeasurement });
  } catch (error) {
    console.error("Error submitting measurement:", error);
    res.status(500).json({ message: error.message || "Server error during submission" });
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
        
        // Note: For full cleanup, we should also delete files from Supabase here.
        // But for now keeping it simple as per request.
        
        res.status(200).json({ message: "Measurement deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete" });
    }
}
