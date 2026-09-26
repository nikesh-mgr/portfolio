import rateLimit from "express-rate-limit";

import env from "../config/env.js";

/*
|--------------------------------------------------------------------------
| Shared Rate-Limit Response
|--------------------------------------------------------------------------
|
| Keep rate-limit responses consistent across the API.
|
*/

const rateLimitMessage = {
  success: false,
  message: "Too many requests. Please try again later.",
};

/*
|--------------------------------------------------------------------------
| Shared Rate-Limit Handler
|--------------------------------------------------------------------------
|
| express-rate-limit already knows the configured status code.
| We explicitly return our API response format so rate-limit
| responses remain consistent with the rest of the backend.
|
*/

const rateLimitHandler = (req, res, options) => {
  return res.status(options.statusCode).json(options.message);
};

/*
|--------------------------------------------------------------------------
| Global API Rate Limiter
|--------------------------------------------------------------------------
|
| Applies to every API request.
|
| Default:
|   100 requests / 15 minutes / IP
|
| The values come from env.js rather than being hard-coded here.
|
| This limiter provides the baseline protection for the complete
| API. Sensitive endpoints can additionally use their own
| stricter limiter below.
|
*/

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,

  limit: env.RATE_LIMIT_MAX,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: rateLimitMessage,

  handler: rateLimitHandler,
});

/*
|--------------------------------------------------------------------------
| Authentication Rate Limiter
|--------------------------------------------------------------------------
|
| Protects:
|   - Login
|   - Initial admin creation
|
| Default:
|   10 requests / 15 minutes / IP
|
| Authentication endpoints are intentionally stricter than the
| normal API because repeated requests can be used for credential
| brute-force attempts.
|
*/

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },

  handler: rateLimitHandler,
});

/*
|--------------------------------------------------------------------------
| Upload Rate Limiter
|--------------------------------------------------------------------------
|
| File uploads consume considerably more server and Cloudinary
| resources than ordinary API requests.
|
| Default:
|   20 uploads / hour / IP
|
*/

export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  limit: 20,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many file uploads. Please try again later.",
  },

  handler: rateLimitHandler,
});

/*
|--------------------------------------------------------------------------
| Contact Rate Limiter
|--------------------------------------------------------------------------
|
| Contact submissions can trigger email processing and therefore
| need stronger protection against spam and email flooding.
|
| Default:
|   5 requests / 15 minutes / IP
|
*/

export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 5,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many contact submissions. Please try again later.",
  },

  handler: rateLimitHandler,
});
