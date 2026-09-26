import crypto from "crypto";

/*
|--------------------------------------------------------------------------
| Request ID Middleware
|--------------------------------------------------------------------------
|
| Every request receives a request ID used for:
|
| - Request tracing
| - Error debugging
| - Log correlation
| - API response identification
|
| A client may provide X-Request-ID, but we validate it before
| accepting it. Invalid or excessively large values are replaced
| with a server-generated UUID.
|
*/

const MAX_REQUEST_ID_LENGTH = 100;

/*
 * UUID v4 format.
 *
 * Accepting UUIDs keeps request IDs predictable and prevents
 * arbitrary strings from unnecessarily entering application logs.
 */
const requestIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const requestIdMiddleware = (req, res, next) => {
  const clientRequestId = req.headers["x-request-id"]?.toString().trim();

  /*
   * Only accept a client-provided request ID when it is:
   *
   * 1. Present
   * 2. Within the allowed length
   * 3. A valid UUID v4
   *
   * Otherwise generate a trusted server-side ID.
   */
  const requestId =
    clientRequestId &&
    clientRequestId.length <= MAX_REQUEST_ID_LENGTH &&
    requestIdPattern.test(clientRequestId)
      ? clientRequestId
      : crypto.randomUUID();

  /*
   * Store the ID on the request so controllers, middleware,
   * and the logger can access it when needed.
   */
  req.requestId = requestId;

  /*
   * Return the same ID to the client.
   *
   * This is useful when debugging an API error because the
   * client can provide the request ID to the developer/admin
   * and the corresponding server log can be located.
   */
  res.setHeader("X-Request-ID", requestId);

  next();
};

export default requestIdMiddleware;
