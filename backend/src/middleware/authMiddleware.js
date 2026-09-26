import Admin from "../models/Admin.js";
import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const decoded = verifyAccessToken(token);

    /**
     * JWT payload:
     *
     * {
     *   sub: admin.id,
     *   role: admin.role
     * }
     *
     * Normalize it for the rest of the application.
     */
    if (!mongoose.isObjectIdOrHexString(decoded.sub) || !decoded.role) {
      throw new ApiError(401, "Invalid authentication token");
    }

    if (decoded.role !== "admin") {
      throw new ApiError(403, "Admin access required");
    }

    const admin = await Admin.findById(decoded.sub)
      .select("role isActive")
      .lean();
    if (!admin) throw new ApiError(401, "Authentication required");
    if (!admin.isActive || admin.role !== "admin")
      throw new ApiError(403, "Admin access required");

    req.admin = {
      id: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Authentication token has expired"));
    }

    if (["JsonWebTokenError", "NotBeforeError"].includes(error.name)) {
      return next(new ApiError(401, "Invalid authentication token"));
    }

    return next(error);
  }
};

export default authMiddleware;
