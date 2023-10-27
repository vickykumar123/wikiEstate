import express from "express";
import { google, login, signup } from "../controller/authcontroller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/google", google);

export default authRouter;
