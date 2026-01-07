import express from "express";

import { createAdmin, createUsers, LoginUser, getAllUsers, updateUserRole } from "../controllers/userControllers.js";

const userRouter = express.Router();


userRouter.post("/register",createUsers);
userRouter.post("/create-admin",createAdmin);
userRouter.post("/login",LoginUser);

// Admin Routes (Add middleware/checks in future)
userRouter.get("/all-users", getAllUsers);
userRouter.put("/:id/role", updateUserRole);






export default userRouter;
