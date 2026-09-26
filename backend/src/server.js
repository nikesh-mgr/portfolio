import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import logger from "./utils/logger.js";

let server;

/*
 * Start the application only after the database connection
 * has been established successfully.
 */
const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          environment: env.NODE_ENV,
        },
        "Server started successfully"
      );
    });
  } catch (error) {
    logger.fatal(
      {
        error,
      },
      "Failed to start server"
    );

    process.exit(1);
  }
};

/*
 * Gracefully shut down the HTTP server.
 *
 * This allows active requests to finish before the process
 * exits instead of terminating connections immediately.
 */
const shutdown = (signal) => {
  logger.info({ signal }, "Shutdown signal received");

  if (!server) {
    process.exit(0);
  }

  server.close((error) => {
    if (error) {
      logger.error(
        {
          error,
        },
        "Error while closing HTTP server"
      );

      process.exit(1);
    }

    logger.info("HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();
