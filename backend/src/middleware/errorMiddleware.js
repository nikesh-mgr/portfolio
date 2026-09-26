import mongoose from "mongoose";
import multer from "multer";

import ApiError from "../utils/apiError.js";
import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, _next) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors = null;

  /*
   * Application error
   */
  if (err instanceof multer.MulterError) {
    statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large"
        : "Invalid multipart upload";
  } else if (["entity.parse.failed", "entity.too.large"].includes(err.type)) {
    statusCode = err.type === "entity.too.large" ? 413 : 400;
    message = statusCode === 413 ? "Request is too large" : "Invalid JSON body";
  } else if (err instanceof ApiError) {
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
