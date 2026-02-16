import User from "../models/user.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";


dotenv.config();


// Create User Signup
export const createUsers = async (req, res) => {
  try {
    const passwordHash = bcrypt.hashSync(req.body.password, 10);

    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: passwordHash,
      role: "customer",
      phone: req.body.phone || "Not Given",
    };

    await User.create(userData);
    res.json({ message: "User Created Successfully" });
  } catch (error) {
    res.json({ message: "Failed to create user", error: error.message });
  }
}


// Create Admin (Backend)
export const createAdmin = async (req, res) => {
  const defaultPassword = "admin123";
  const passwordHash = bcrypt.hashSync(defaultPassword, 10);

  const userData = {
    firstName: "Admin",
    lastName: "User",
    email: req.body.email,
    password: passwordHash,
    role: "admin",
    phone: "Not Given",
    isEmailVerified: true,
  };

  try {
    await User.create(userData);
    res.json({
      message: "Admin Created Successfully with default details",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create admin",
      error: error.message,
    });
  }
}


// login Users
export const LoginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // block check
    if (user.isBlock) {
      return res
        .status(403)
        .json({ message: "Your account has been blocked. Please contact support." });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (isPasswordCorrect) {
      const token = jwt.sign(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isBlock: user.isBlock,
          isEmailVerified: user.isEmailVerified,
          image: user.image,
        },
        process.env.JWT_SECRET
      );

      res.json({
        token: token,
        message: "Login Successful",
        user: {
          id: user.id, // Sequelize uses id (int), not _id
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(403).json({ message: "Incorrect Password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login Failed", error: error.message });
  }
}

// isAdmin
export function isAdmin(req) {
  if (req.user == null) return false;
  return req.user.role === "admin";
}


// Get All Admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({ where: { role: "admin" } });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Failed to load admins", error: error.message });
  }
};

// Delete admin by email
export const deleteAdmin = async (req, res) => {
  const email = req.params.email;

  try {
    const deleted = await User.destroy({ where: { email: email, role: "admin" } });
    if (!deleted) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete admin", error: error.message });
  }
};

// Get All Users (for Admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ order: [['createdAt', 'DESC']] });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// Update User Role
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        const [updated] = await User.update(
            { role: role },
            { where: { id: id } }
        );
        
        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const updatedUser = await User.findByPk(id);
        res.json({ message: "Role updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating role" });
    }
};
