import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { getAuthenticatedAdmin } from "../services/authService.js";
import env from "../config/env.js";

/*
|--------------------------------------------------------------------------
| CSRF-sensitive HTTP methods
|--------------------------------------------------------------------------
|
| Authentication uses an HTTP-only cookie. Because browsers automatically
| attach cookies to requests, state-changing requests need an additional
| origin check to prevent cross-site request forgery (CSRF).
|
*/

const stateChangingMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/*
|--------------------------------------------------------------------------
| Verify request origin
|--------------------------------------------------------------------------
|
| Browser requests normally provide an Origin header.
|
| Rules:
|
| 1. If Origin exists, it MUST exactly match FRONTEND_URL.
| 2. If Origin is absent but Referer exists, its origin MUST match.
| 3. If both are absent, allow the request so Postman and server-to-server
|    clients continue to work.
|
| This check is only performed for authenticated state-changing requests.
| Public GET requests do not need this middleware.
|
*/

const verifyRequestOrigin = (req) => {
  if (!stateChangingMethods.has(req.method)) {
    return;
  }

  const origin = req.headers.origin?.trim();

  /*
   * Origin is the strongest browser signal available here.
   * Never accept a different origin when it is explicitly provided.
   */
  if (origin) {
    if (origin !== env.FRONTEND_URL) {
      throw new ApiError(403, "Invalid request origin");
    }

    return;
  }

  /*
   * Some clients may not send Origin.
   * If Referer is available, verify its origin.
   */
  const referer = req.headers.referer?.trim();

  if (!referer) {
    /*
     * No browser-origin headers.
     *
     * This keeps Postman and server-to-server API clients functional.
     */
    return;
  }

  try {
    const refererUrl = new URL(referer);

    if (refererUrl.origin !== env.FRONTEND_URL) {
      throw new ApiError(403, "Invalid request origin");
    }
  } catch (error) {
    /*
     * Preserve our intentional ApiError.
     * Any malformed Referer is rejected rather than trusted.
     */
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(403, "Invalid request origin");
  }
};

/*
|--------------------------------------------------------------------------
| Authentication middleware
|--------------------------------------------------------------------------
|
| Responsibilities:
|
| 1. Verify CSRF/origin requirements for state-changing requests.
| 2. Read the HTTP-only accessToken cookie.
| 3. Verify the JWT signature.
| 4. Verify JWT expiration, issuer, and audience.
| 5. Validate required JWT claims.
| 6. Require the admin role.
| 7. Confirm the admin still exists and is active.
| 8. Attach only the minimum identity information to req.admin.
|
*/

const authMiddleware = async (req, res, next) => {
  try {
    /*
     * Perform the origin check before accepting an authenticated
     * state-changing browser request.
     */
    verifyRequestOrigin(req);

    /*
     * Authentication intentionally uses only the HTTP-only cookie.
     *
     * We do not read Authorization headers because the portfolio's
     * authentication contract is cookie-based.
     */
    const token = req.cookies?.accessToken;

    if (!token || typeof token !== "string") {
      throw new ApiError(401, "Authentication required");
    }

    /*
     * verifyAccessToken() validates:
     *
     * - token signature
     * - expiration
     * - issuer
     * - audience
     *
     * JWT errors are normalized below.
     */
    const decoded = verifyAccessToken(token);

    /*
     * Validate the claims required by this application.
     */
    if (
      !decoded ||
      typeof decoded !== "object" ||
      typeof decoded.sub !== "string" ||
      !decoded.sub.trim() ||
      typeof decoded.role !== "string" ||
      !decoded.role.trim()
    ) {
      throw new ApiError(401, "Invalid authentication token");
    }

    /*
     * This middleware is specifically for admin-protected routes.
     */
    if (decoded.role !== "admin") {
      throw new ApiError(403, "Admin access required");
    }

    /*
     * A valid JWT does not guarantee that access should still be allowed.
     *
     * The account could have been:
     * - deleted
     * - deactivated
     *
     * Therefore, always verify the current database state.
     */
    const admin = await getAuthenticatedAdmin(decoded.sub);

    /*
     * Keep req.admin intentionally minimal.
     *
     * Never attach:
     * - password
     * - JWT
     * - full Mongoose document
     * - unnecessary private account data
     */
    req.admin = {
      id: admin._id.toString(),
      role: admin.role,
    };

    return next();
  } catch (error) {
    /*
     * Preserve known application errors.
     */
    if (error instanceof ApiError) {
      return next(error);
    }

    /*
     * JWT has expired.
     */
    if (error?.name === "TokenExpiredError") {
      return next(new ApiError(401, "Authentication token has expired"));
    }

    /*
     * JWT was malformed, had an invalid signature, or failed one
     * of jsonwebtoken's verification checks such as issuer/audience.
     */
    if (error?.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid authentication token"));
    }

    /*
     * Token uses a future "not before" timestamp.
     *
     * Treat it as an invalid authentication token rather than exposing
     * implementation details to the client.
     */
    if (error?.name === "NotBeforeError") {
      return next(new ApiError(401, "Invalid authentication token"));
    }

    /*
     * Unexpected errors continue to the centralized error middleware.
     */
    return next(error);
  }
};

export default authMiddleware;
