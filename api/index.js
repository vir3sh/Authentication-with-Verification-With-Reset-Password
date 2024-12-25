import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = 5000;

connectDB();
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log("Error connecting to MongoDB:", err));

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// API END POINTS

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.use("/api/auth", userRoutes);

app.listen(PORT, (req, res) => {
  console.log("listennig on port 5000");
});
