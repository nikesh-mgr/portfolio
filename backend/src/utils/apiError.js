class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);

    this.name = "ApiError";

    /*
     * Only HTTP error status codes are accepted.
     *
     * If an invalid status code is supplied internally,
     * fall back to 500 rather than returning an invalid response.
     */
    this.statusCode =
      Number.isInteger(statusCode) &&
      statusCode >= 400 &&
      statusCode <= 599
        ? statusCode
        : 500;

    this.success = false;
    this.errors = errors;

    /*
     * Preserve the correct stack trace so application errors
     * remain easy to debug.
     */
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;