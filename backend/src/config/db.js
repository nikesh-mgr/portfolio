import mongoose from "mongoose";

import env from "./env.js";
import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| MongoDB Connection
|--------------------------------------------------------------------------
 *
 * Establishes the MongoDB connection before the HTTP server
 * starts accepting requests.
 */

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    logger.info("MongoDB connected successfully");

    /*
     * MongoDB connection events.
     *
     * These are useful for detecting connection problems after
     * the application has already started.
     */

    mongoose.connection.on("error", (error) => {
      logger.error(
        {
          err: error,
        },
        "MongoDB connection error"
      );
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "MongoDB connection failed"
    );

    /*
     * Let server.js decide how the application should terminate.
     */
    throw error;
  }
};

export default connectDatabase;
