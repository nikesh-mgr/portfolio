import dotenv from "dotenv";

dotenv.config();

/*
|--------------------------------------------------------------------------
| Required Environment Variables
|--------------------------------------------------------------------------
*/

const requiredEnvVariables = [
  "MONGODB_URI",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "FRONTEND_URL",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASSWORD",
  "EMAIL_FROM",
  "CONTACT_EMAIL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingEnvVariables = requiredEnvVariables.filter(
  (key) => !process.env[key]?.trim()
);

if (missingEnvVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVariables.join(", ")}`
  );
}

/*
|--------------------------------------------------------------------------
| Environment
|--------------------------------------------------------------------------
*/

const NODE_ENV = process.env.NODE_ENV || "development";

const allowedEnvironments = ["development", "test", "production"];

if (!allowedEnvironments.includes(NODE_ENV)) {
  throw new Error(
    `Invalid NODE_ENV. Expected one of: ${allowedEnvironments.join(", ")}`
  );
}

/*
|--------------------------------------------------------------------------
| Port
|--------------------------------------------------------------------------
*/

const PORT = Number(process.env.PORT || 5000);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

/*
|--------------------------------------------------------------------------
| JWT
|--------------------------------------------------------------------------
*/

const JWT_SECRET = process.env.JWT_SECRET.trim();

if (JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN.trim();

if (!JWT_EXPIRES_IN) {
  throw new Error("JWT_EXPIRES_IN cannot be empty");
}

/*
|--------------------------------------------------------------------------
| Frontend URL
|--------------------------------------------------------------------------
*/

const FRONTEND_URL = process.env.FRONTEND_URL.trim();

try {
  const frontendUrl = new URL(FRONTEND_URL);

  if (!["http:", "https:"].includes(frontendUrl.protocol)) {
    throw new Error();
  }

  /*
   * Credentials-based CORS should not use a wildcard origin.
   * FRONTEND_URL is therefore kept as one explicit origin.
   */
  if (frontendUrl.username || frontendUrl.password) {
    throw new Error();
  }
} catch {
  throw new Error("FRONTEND_URL must be a valid HTTP or HTTPS URL");
}

/*
|--------------------------------------------------------------------------
| Email
|--------------------------------------------------------------------------
*/

const EMAIL_PORT = Number(process.env.EMAIL_PORT);

if (!Number.isInteger(EMAIL_PORT) || EMAIL_PORT < 1 || EMAIL_PORT > 65535) {
  throw new Error("EMAIL_PORT must be an integer between 1 and 65535");
}

const EMAIL_SECURE = process.env.EMAIL_SECURE === "true";

/*
 * Port 465 normally uses an implicit TLS connection.
 * Port 587 normally uses STARTTLS.
 *
 * Reject obviously inconsistent configuration instead of
 * silently starting the mail transporter incorrectly.
 */
if (EMAIL_SECURE && EMAIL_PORT !== 465) {
  throw new Error("EMAIL_SECURE=true requires EMAIL_PORT=465");
}

if (!EMAIL_SECURE && EMAIL_PORT === 465) {
  throw new Error("EMAIL_PORT=465 requires EMAIL_SECURE=true");
}

/*
|--------------------------------------------------------------------------
| Cloudinary
|--------------------------------------------------------------------------
*/

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME.trim();

const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY.trim();

const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET.trim();

/*
|--------------------------------------------------------------------------
| Rate Limiting
|--------------------------------------------------------------------------
 *
 * Environment variables are strings, so convert them into
 * validated numbers before exposing them to the application.
 *
 * Example:
 * RATE_LIMIT_WINDOW_MS=900000
 * RATE_LIMIT_MAX=100
 */

const RATE_LIMIT_WINDOW_MS = Number(
  process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000
);

const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 100);

if (!Number.isInteger(RATE_LIMIT_WINDOW_MS) || RATE_LIMIT_WINDOW_MS < 1000) {
  throw new Error(
    "RATE_LIMIT_WINDOW_MS must be an integer of at least 1000 milliseconds"
  );
}

if (!Number.isInteger(RATE_LIMIT_MAX) || RATE_LIMIT_MAX < 1) {
  throw new Error("RATE_LIMIT_MAX must be a positive integer");
}

/*
|--------------------------------------------------------------------------
| Export Configuration
|--------------------------------------------------------------------------
*/

const env = Object.freeze({
  NODE_ENV,

  PORT,

  LOG_LEVEL: process.env.LOG_LEVEL?.trim() || "info",

  MONGODB_URI: process.env.MONGODB_URI.trim(),

  FRONTEND_URL,

  JWT_SECRET,

  JWT_EXPIRES_IN,

  EMAIL: Object.freeze({
    HOST: process.env.EMAIL_HOST.trim(),
    PORT: EMAIL_PORT,
    SECURE: EMAIL_SECURE,
    USER: process.env.EMAIL_USER.trim(),
    PASSWORD: process.env.EMAIL_PASSWORD,
    FROM: process.env.EMAIL_FROM.trim(),
    CONTACT_EMAIL: process.env.CONTACT_EMAIL.trim(),
  }),

  CLOUDINARY: Object.freeze({
    CLOUD_NAME: CLOUDINARY_CLOUD_NAME,
    API_KEY: CLOUDINARY_API_KEY,
    API_SECRET: CLOUDINARY_API_SECRET,
  }),

  RATE_LIMIT_WINDOW_MS,

  RATE_LIMIT_MAX,
});

export default env;
