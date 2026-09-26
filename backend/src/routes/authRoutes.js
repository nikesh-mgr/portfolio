import express from "express";

import {
  createAdminController,
  loginController,
  getCurrentAdminController,
  logoutController,
  updateAdminProfileImage,
  removeAdminProfileImage,
  updateAdminResume,
  deleteAdminResume,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resumeUploadMiddleware from "../middleware/resumeUploadMiddleware.js";

import {
  authRateLimiter,
  uploadRateLimiter,
} from "../middleware/rateLimiter.js";

import validate from "../middleware/validateMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

import { createAdminSchema, loginSchema } from "../validators/authValidator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

/**
 * POST /api/auth/create-admin
 *
 * Creates the initial admin account.
 *
 * Rate limited because this endpoint is intentionally public during
 * initial application setup.
 */
router.post(
  "/create-admin",
  authRateLimiter,
  validate(createAdminSchema),
  asyncHandler(createAdminController)
);

/**
 * POST /api/auth/login
 *
 * Authenticates the admin and creates an HTTP-only accessToken cookie.
 */
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  asyncHandler(loginController)
);

/**
 * POST /api/auth/logout
 *
 * Clears the authentication cookie.
 *
 * This endpoint does not require authentication because logout should
 * still work when the token is already expired or otherwise invalid.
 */
router.post("/logout", asyncHandler(logoutController));

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated admin.
 */
router.get("/me", authMiddleware, asyncHandler(getCurrentAdminController));

/*
|--------------------------------------------------------------------------
| Profile Image
|--------------------------------------------------------------------------
*/

/**
 * PATCH /api/auth/profile/image
 *
 * Upload or replace the authenticated admin's profile image.
 *
 * Middleware order is intentional:
 *
 * authMiddleware
 *     ↓
 * uploadRateLimiter
 *     ↓
 * image validation / Multer
 *     ↓
 * controller
 */
router.patch(
  "/profile/image",
  authMiddleware,
  uploadRateLimiter,
  uploadMiddleware.single("image"),
  asyncHandler(updateAdminProfileImage)
);

/**
 * DELETE /api/auth/profile/image
 *
 * Remove the authenticated admin's profile image.
 */
router.delete(
  "/profile/image",
  authMiddleware,
  asyncHandler(removeAdminProfileImage)
);

/*
|--------------------------------------------------------------------------
| Admin Resume
|--------------------------------------------------------------------------
*/

/**
 * POST /api/auth/resume
 *
 * Upload or replace the authenticated admin's resume.
 *
 * The resume endpoint uses the dedicated PDF upload middleware.
 * It must NOT use the image upload middleware.
 */
router.post(
  "/resume",
  authMiddleware,
  uploadRateLimiter,
  resumeUploadMiddleware.single("resume"),
  asyncHandler(updateAdminResume)
);

/**
 * DELETE /api/auth/resume
 *
 * Remove the authenticated admin's resume.
 */
router.delete("/resume", authMiddleware, asyncHandler(deleteAdminResume));

export default router;
