import User from "../models/User.js";
import { resetPassword } from "./authController.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isVerified: user.isAccountVerified,
        resetPassword: user.resetOtp,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
