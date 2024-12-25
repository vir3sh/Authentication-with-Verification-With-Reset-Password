import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  mongoose
    .connect("mongodb+srv://pviresh508:@authentication.mw7ob.mongodb.net/")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));
};

export default connectDB;
