import mongoose from "mongoose";
import multer from "multer";

import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Global Error Middleware
|--------------------------------------------------------------------------
|
| All application errors eventually reach this middleware.
|
| Responsibilities:
|
| - Convert known errors into consistent API responses.
| - Hide unexpected internal details in production.
| - Log errors for debugging.
| - Include request ID for log/request correlation.
|
*/

const errorMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors = null;

  /*
  |--------------------------------------------------------------------------
  | Application Error
  |--------------------------------------------------------------------------
  */

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  /*
  |--------------------------------------------------------------------------
  | Mongoose Validation Error
  |--------------------------------------------------------------------------
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
  |--------------------------------------------------------------------------
  | MongoDB Duplicate Key Error
  |--------------------------------------------------------------------------
  */
  else if (err?.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue || {})[0];

    if (field === "slug") {
      message = "A record with this slug already exists";
    } else if (field === "email") {
      message = "An account with this email already exists";
    } else {
      message = "A record with this value already exists";
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Invalid MongoDB ObjectId
  |--------------------------------------------------------------------------
  */
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  /*
  |--------------------------------------------------------------------------
  | Multer Upload Errors
  |--------------------------------------------------------------------------
  */
  else if (err instanceof multer.MulterError) {
    statusCode = 400;

    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "Uploaded file is too large. Maximum allowed size is 5 MB";
        break;

      case "LIMIT_FILE_COUNT":
        message = "Too many files uploaded";
        break;

      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file field";
        break;

      case "LIMIT_FIELD_COUNT":
        message = "Too many form fields";
        break;

      case "LIMIT_PART_COUNT":
        message = "Too many multipart form parts";
        break;

      case "LIMIT_FIELD_KEY":
        message = "Form field name is too long";
        break;

      case "LIMIT_FIELD_VALUE":
        message = "Form field value is too large";
        break;

      case "LIMIT_HEADER_COUNT":
        message = "Too many multipart headers";
        break;

      default:
        message = "File upload failed";
    }
  }

  /*
  |--------------------------------------------------------------------------
  | File Filter Errors
  |--------------------------------------------------------------------------
  */
  else if (
    err?.message === "Invalid resume file. Only PDF files are allowed." ||
    err?.message ===
      "Invalid image type. Only JPEG, PNG, and WebP images are allowed."
  ) {
    statusCode = 400;
    message = err.message;
  }

  /*
  |--------------------------------------------------------------------------
  | Unexpected Error
  |--------------------------------------------------------------------------
  |
  | Never expose the original error message for unexpected
  | server errors.
  |
  */
  else {
    logger.error(
      {
        err,
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
      },
      "Unhandled application error"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Log Client Errors
  |--------------------------------------------------------------------------
  */

  if (statusCode < 500) {
    logger.warn(
      {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode,
        message,
      },
      "Client request error"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Response
  |--------------------------------------------------------------------------
  */

  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  /*
  |--------------------------------------------------------------------------
  | Production Error Protection
  |--------------------------------------------------------------------------
  |
  | Development can expose the known application message.
  | Unexpected 500-level details remain hidden in production.
  |
  */

  if (statusCode >= 500 && env.NODE_ENV !== "development") {
    response.message = "Internal server error";
  }

  return res.status(statusCode).json(response);
};

export default errorMiddleware;
