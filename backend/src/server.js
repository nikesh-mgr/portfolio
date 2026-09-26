import mongoose from "mongoose";
import Admin from "./models/Admin.js";

import app from "./app.js";
import connectDatabase from "./config/db.js";
import env from "./config/env.js";
import logger from "./utils/logger.js";

const startServer = async () => {
  try {
    await connectDatabase();
    await Admin.init();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          await mongoose.connection.close();

          logger.info("MongoDB connection closed");

          process.exit(0);
        } catch (error) {
          logger.error(
            {
              err: error,
            },
            "Error while closing MongoDB connection"
          );

          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Server startup failed"
    );

    process.exit(1);
  }
};

startServer();
