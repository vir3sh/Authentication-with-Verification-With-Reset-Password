import User from "../models/User.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";
import pkg from "bcryptjs";
import transporter from "../config/nodemailer.js";
import SendmailTransport from "nodemailer/lib/sendmail-transport/index.js";
import userAuth from "../middleware/userAuth.js";
const { compare } = pkg;

//REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Fill all fields" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "WElcome to Perfect Authentication",
      text: `Thankyou for registering to my perfect authentication .Your accound has been created with id : ${email}`,
    };

    try {
      await transporter.sendMail(mailOption);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send registration email",
        error: error.message,
      });
    }

    // Send response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while registering the user",
      error: error,
    });
  }
};

//LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "fill all fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response
    return res.status(201).json({
      success: true,
      message: "login successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

//LOGOUUT
export const logout = async (req, res) => {
  try {
    // localStorage.clearCookie;
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "logout successful" });
  } catch (error) {
    console.log(error);
  }
};

//VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already Verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "OTP Verfication",
      text: `your OTP is ${otp} .Verify your account with this OTP`,
    };

    try {
      await transporter.sendMail(mailOption);
      console.log("OTP sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send registration email",
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "OTP sended successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

//FOR VERIFYING ACCOUNT
export const VerifyAccount = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Fill all fields" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if OTP is invalid or not set
    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (user.verifyOtpExpiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    // Proceed with account verification
    user.isAccountVerified = true;
    user.verifyOtp = ""; // Clear OTP after successful verification
    user.verifyOtpExpiresAt = 0; // Reset OTP expiration time

    await user.save();

    // Prepare verification success email
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verified successfully",
      text: `Your account is verified with mail Name: ${user.name}, ${user.email} and OTP: ${otp}`,
    };

    try {
      await transporter.sendMail(mailOption);
      console.log("OTP sent successfully");
    } catch (error) {
      // console.error("Failed to send email:", error);
      return res.status(400).json({
        success: false,
        message: "Failed to send confirmation email",
        error: error.message,
      });
    }

    // Success response
    return res.status(201).json({
      success: true,
      message: "Account Verified successfully",
    });
  } catch (error) {
    console.error("Error in VerifyAccount:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//CHECK IF ACC IS VERIFIED
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "true" });
  } catch (error) {
    console.log(error);
  }
};

//OTP FOR REST PASSWORD
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is verified" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() * 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Password OTP",
      text: `your OTP for Reset Password is ${otp} Use this OTP for reseting password`,
    };

    try {
      await transporter.sendMail(mailOption);
      console.log("OTP sent successfully");
    } catch (error) {
      console.error("Failed to send email:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send reet password OTP",
        error: error.message,
      });
    }

    return res.json({ success: true, message: "Reset OTP Send Successfully" });
  } catch (error) {
    console.log(error);
  }
};

//RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) {
    return res.json({ success: false, message: "Fill all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetOtp == "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "OTP is invalid" });
    }
    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpiresAt = 0;

    await user.save();

    return res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log(error);
  }
};
