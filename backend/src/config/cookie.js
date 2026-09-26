import env from "./env.js";

/*
|--------------------------------------------------------------------------
| Access Token Cookie
|--------------------------------------------------------------------------
 *
 * Authentication uses an HTTP-only cookie rather than exposing
 * the JWT to frontend JavaScript.
 */

export const accessTokenCookieOptions = {
  /*
   * JavaScript running in the browser cannot read this cookie.
   * This helps protect the JWT against token theft through
   * client-side JavaScript.
   */
  httpOnly: true,

  /*
   * HTTPS is required for the authentication cookie in production.
   */
  secure: env.NODE_ENV === "production",

  /*
   * Development:
   *   SameSite=Lax works with localhost frontend/API development.
   *
   * Production:
   *   SameSite=None is required if your deployed frontend and
   *   backend are genuinely cross-site.
   *
   * Because this project uses cookie authentication, CSRF
   * protection will be handled separately in the authentication
   * security phase rather than changing the cookie contract here.
   */
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",

  /*
   * JWT_EXPIRES_IN is currently configured as 1d.
   *
   * Keep the cookie lifetime aligned with the current JWT
   * authentication lifetime.
   */
  maxAge: 24 * 60 * 60 * 1000,

  /*
   * Make the authentication cookie available to the entire API.
   */
  path: "/",
};
