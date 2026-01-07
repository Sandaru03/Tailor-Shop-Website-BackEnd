import Availability from '../models/Availability.js';

// Admin: Set Availability for a date
export const setAvailability = async (req, res) => {
  const { date, slots } = req.body;
  
  if (!date || !slots) {
    return res.status(400).json({ message: "Date and Slots are required" });
  }

  try {
    // Upsert: Update if exists, otherwise insert
    // We replace the slots array entirely with the new slots provided by Admin
    // Ideally Admin UI should send the full list of desired slots for that day
    const availability = await Availability.findOneAndUpdate(
      { date },
      { slots }, // slots structure: [{ time: "10:00 AM", isBooked: false }]
      { new: true, upsert: true }
    );
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public: Get all availability (or filtered by date if needed)
export const getAvailability = async (req, res) => {
  try {
    // Return all dates. Frontend can filter.
    const availability = await Availability.find({});
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
