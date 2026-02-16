import Availability from '../models/Availability.js';

// Admin: Set Availability for a date
export const setAvailability = async (req, res) => {
  const { date, slots } = req.body;
  
  if (!date || !slots) {
    return res.status(400).json({ message: "Date and Slots are required" });
  }

  try {
    // Upsert: Update if exists, otherwise insert
    // Sequelize upsert returns [instance, created] boolean in some dialects, or valid object
    const [availability, created] = await Availability.upsert(
      { date, slots }
    );
    // Note: upsert return value depends on Sequelize version and dialect. 
    // For MySQL it usually returns [instance, boolean] or just boolean if result is not supported.
    // To be safe, we can fetch it or just return what we sent if upsert is void.
    // But mostly looking for 'date' to match.
    
    // Let's fetch the updated record to return it correctly
    const updatedAvailability = await Availability.findOne({ where: { date } });
    
    res.status(200).json(updatedAvailability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public: Get all availability (or filtered by date if needed)
export const getAvailability = async (req, res) => {
  try {
    // Return all dates. Frontend can filter.
    const availability = await Availability.findAll();
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
