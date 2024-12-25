import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Adjust as needed
    connectTimeoutMS: 10000, // Increase connection timeout
  });
};

export default connectDB;
