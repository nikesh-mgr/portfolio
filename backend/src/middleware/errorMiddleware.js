import mongoose from "mongoose";

import ApiError from "../utils/apiError.js";
import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors = null;

  /*
   * Application error
   */
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  /*
   * Mongoose validation error
   */
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";

    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  }

  /*
   * MongoDB duplicate key error
   */
  else if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue || {})[0];

    if (field === "slug") {
      message = "A project with this slug already exists";
    } else if (field === "email") {
      message = "An admin with this email already exists";
    } else {
      message = "A record with this value already exists";
    }
  }

  /*
   * Invalid MongoDB ObjectId
   */
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  /*
   * Unexpected server error
   */
  else {
    logger.error(
      {
        err,
        method: req.method,
        url: req.originalUrl,
      },
      "Unhandled application error"
    );
  }

  /*
   * Log client/application errors
   */
  if (statusCode < 500) {
    logger.warn(
      {
        method: req.method,
        url: req.originalUrl,
        statusCode,
        message,
      },
      "Client request error"
    );
  }

  /*
   * Response
   */
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  /*
   * Do not expose internal error details in production.
   */
  if (statusCode >= 500 && process.env.NODE_ENV !== "development") {
    response.message = "Internal server error";
  }

  return res.status(statusCode).json(response);
};

export default errorMiddleware;
