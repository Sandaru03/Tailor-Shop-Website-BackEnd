import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    measurements: {
      neck: String,
      shoulder: String,
      chest: String,
      waist: String,
      hips: String,
      sleeve: String,
      frontLength: String,
      backLength: String,
    },
    videoFront: { type: String, default: null }, // Path to uploaded file
    videoBack: { type: String, default: null },  // Path to uploaded file
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'completed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const Measurement = mongoose.model("Measurement", measurementSchema);
export default Measurement;
