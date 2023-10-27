import express from "express";
import {
  deleteUser,
  updateUser,
  getUserListing,
} from "../controller/userController.js";
import { protect } from "../controller/authcontroller.js";

const userRouter = express.Router();

userRouter.patch("/update/:Id", protect, updateUser);
userRouter.delete("/delete/:Id", protect, deleteUser);
userRouter.get("/listing/:Id", protect, getUserListing);

export default userRouter;
