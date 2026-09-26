import env from "../config/env.js";
import ApiError from "../utils/apiError.js";

// CORS controls response access; this also rejects cross-site form submissions.
export default function requestOriginMiddleware(req, _res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("origin");
  if (
    (origin && origin !== new URL(env.FRONTEND_URL).origin) ||
    (!origin && req.get("sec-fetch-site") === "cross-site")
  ) {
    return next(new ApiError(403, "Request origin is not allowed"));
  }
  next();
}
