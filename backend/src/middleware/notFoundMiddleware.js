import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| 404 Not Found Middleware
|--------------------------------------------------------------------------
|
| Runs only after all registered routes have been checked.
|
*/

const notFoundMiddleware = (req, res, next) => {
  return next(new ApiError(404, "Route not found"));
};

export default notFoundMiddleware;
