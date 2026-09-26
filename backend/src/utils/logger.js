import pino from "pino";

import env from "../config/env.js";

const isProduction = env.NODE_ENV === "production";

/*
|--------------------------------------------------------------------------
| Application Logger
|--------------------------------------------------------------------------
|
| Authentication credentials, cookies, tokens, and passwords must
| never appear in application logs.
|
*/

const logger = pino({
  level: env.LOG_LEVEL,

  redact: {
    paths: [
      /*
       * HTTP authentication data
       */
      "req.headers.authorization",
      "req.headers.cookie",
      "headers.authorization",
      "headers.cookie",

      /*
       * Authentication secrets
       */
      "password",
      "currentPassword",
      "newPassword",
      "accessToken",
      "refreshToken",
      "token",

      /*
       * Common request-body credential fields
       */
      "req.body.password",
      "req.body.currentPassword",
      "req.body.newPassword",

      /*
       * Common API credential names.
       */
      "apiKey",
      "apiSecret",
      "secret",
      "req.body.apiKey",
      "req.body.apiSecret",
      "req.body.secret",
    ],

    censor: "[REDACTED]",
  },

  /*
   * Pretty logs are useful during local development.
   * Production uses structured JSON logs.
   */
  transport: !isProduction
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
        },
      }
    : undefined,
});

export default logger;
