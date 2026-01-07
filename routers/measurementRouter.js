import express from "express";
import { upload, createMeasurement, getMeasurements, deleteMeasurement } from "../controllers/measurementController.js";

const router = express.Router();

// Public: Submit measurements (with multiple video files)
router.post(
  "/",
  upload.fields([
    { name: "videoFront", maxCount: 1 },
    { name: "videoBack", maxCount: 1 },
  ]),
  createMeasurement
);

// Admin: Get all measurements (Future: Add auth middleware)
router.get("/", getMeasurements);

// Admin: Delete (Future: Add auth middleware)
router.delete("/:id", deleteMeasurement);

export default router;
