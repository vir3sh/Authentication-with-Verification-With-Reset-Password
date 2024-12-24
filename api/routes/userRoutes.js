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

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/verifyOtp", userAuth, verifyOtp);
authRouter.post("/verifyAccount", userAuth, VerifyAccount);
authRouter.post("/isAuthenticated", userAuth, isAuthenticated);
authRouter.post("/sendResetOtp", userAuth, sendResetOtp);
authRouter.post("/resetPassword", userAuth, resetPassword);

export default authRouter;
