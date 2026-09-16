import mongoose from "mongoose";

import env from "./env.js";
import logger from "../utils/logger.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "MongoDB connection failed"
    );

    process.exit(1);
  }
};

export default connectDatabase;
