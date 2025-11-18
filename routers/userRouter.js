import express from "express";

import { createAdmin, createUsers, LoginUser } from "../controllers/userControllers.js";

const userRouter = express.Router();


userRouter.post("/",createUsers);
userRouter.post("/create-admin",createAdmin);
userRouter.post("/login",LoginUser);






export default userRouter;
