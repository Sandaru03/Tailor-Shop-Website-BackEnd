import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  garmentType: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:MM AM/PM
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Appointment', appointmentSchema);
