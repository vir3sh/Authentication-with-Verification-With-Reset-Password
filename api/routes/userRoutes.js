import express from "express";
import {
  login,
  logout,
  register,
  verifyOtp,
  VerifyAccount,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
import { getUserData } from "../controllers/userController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/verifyOtp", userAuth, verifyOtp);
authRouter.post("/verifyAccount", userAuth, VerifyAccount);
authRouter.post("/isAuthenticated", userAuth, isAuthenticated);
authRouter.post("/sendResetOtp", userAuth, sendResetOtp);
authRouter.get("/getUserData", userAuth, getUserData);

export default authRouter;
