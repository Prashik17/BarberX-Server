import mongoose from "mongoose";
import { logger } from "./logger";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URL;
    if (!mongoUri) {
      throw new Error("MONGO_URL environment variable is not defined");
    }
    await mongoose.connect(mongoUri);
    logger.info("✅ MongoDB connected successfully");
  } catch (err: any) {
    logger.error("❌ MongoDB connection error: " + err.message);
    process.exit(1);
  }
};
