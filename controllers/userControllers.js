import User from "../models/user.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";


dotenv.config();


// Create User Signup
export function createUsers(req, res) {
  const passwordHash = bcrypt.hashSync(req.body.password, 10);

  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: passwordHash,
    role: "customer",
    phone: req.body.phone || "Not Given",
  };

  const user = new User(userData);

  user
    .save()
    .then(() => {
      res.json({ message: "User Created Successfully" });
    })
    .catch(() => {
      res.json({ message: "Failed to create user" });
    });
}


// Create Admin (Backend)
export function createAdmin(req, res) {
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

  const user = new User(userData);

  user
    .save()
    .then(() => {
      res.json({
        message: "Admin Created Successfully with default details",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed to create admin",
        error,
      });
    });
}


// login Users
export function LoginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
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
          message: "Login Successful",
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          }
        });
      } else {
        res.status(403).json({ message: "Incorrect Password" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Login Failed", error: error.message });
    });
}

// isAdmin
export function isAdmin(req) {
  if (req.user == null) return false;
  return req.user.role === "admin";
}


// Get All Admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Failed to load admins", error });
  }
};

// Delete admin by email
export const deleteAdmin = async (req, res) => {
  const email = req.params.email;

  try {
    const deleted = await User.findOneAndDelete({ email: email, role: "admin" });
    if (!deleted) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete admin", error });
  }
};

// Get All Users (for Admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
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
        
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { role: role },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json({ message: "Role updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating role" });
    }
};
