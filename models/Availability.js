import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  slots: [{
    time: { type: String, required: true }, // Format: HH:MM AM/PM
    isBooked: { type: Boolean, default: false }
  }]
});

export default mongoose.model('Availability', availabilitySchema);
