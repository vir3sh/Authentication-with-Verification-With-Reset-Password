import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = 5000;
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow credentials
};
app.use(cors(corsOptions));

connectDB();

app.use(express.json());
app.use(cookieParser());

// API END POINTS

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.use("/api/auth", userRoutes);

// app.use(
//   "/api/auth",
//   (req, res, next) => {
//     console.log("Received request at /api/auth");
//     next();
//   },
//   userRoutes
// );
app.listen(PORT, (req, res) => {
  console.log("listennig on port 5000");
});
