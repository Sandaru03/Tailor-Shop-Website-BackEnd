import Appointment from '../models/Appointment.js';


// Create New Appointment
export const createAppointment = async (req, res) => {
  const { customerName, contactNumber, garmentType, gender, date, time } = req.body;

  try {
    // 1. Check if slot is already booked (Collision Detection)
    const existingAppointment = await Appointment.findOne({ where: { date, time } });
    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

    // 2. Save Appointment
    const newAppointment = await Appointment.create({
      customerName,
      contactNumber,
      garmentType,
      gender,
      date,
      time
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get All Appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
