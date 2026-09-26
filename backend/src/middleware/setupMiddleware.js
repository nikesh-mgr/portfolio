import { timingSafeEqual } from "node:crypto";
import env from "../config/env.js";
import ApiError from "../utils/apiError.js";

export default function setupMiddleware(req, _res, next) {
  const expected = env.ADMIN_SETUP_TOKEN;
  const provided = req.get("x-admin-setup-token");
  if (!expected || expected.length < 32 || !provided) {
    return next(new ApiError(403, "Admin setup is disabled or unauthorized"));
  }
  const actualBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return next(new ApiError(403, "Admin setup is disabled or unauthorized"));
  }
  next();
}
