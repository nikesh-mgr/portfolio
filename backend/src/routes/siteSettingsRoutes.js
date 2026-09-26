import express from "express";

import {
  getSettings,
  createSettings,
  updateSettings,
  createProfileImageController,
  updateProfileImageController,
  deleteProfileImageController,
  deleteSettings,
} from "../controllers/siteSettingsController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * Public route.
 */
router.get("/", asyncHandler(getSettings));

/**
 * Admin site settings.
 */
router.post("/", authMiddleware, asyncHandler(createSettings));

router.patch("/", authMiddleware, asyncHandler(updateSettings));

/**
 * Profile image.
 *
 * POST = first upload
 */
router.post(
  "/profile-image",
  authMiddleware,
  uploadMiddleware.single("profileImage"),
  asyncHandler(createProfileImageController)
);

/**
 * PATCH = replace/update existing image
 */
router.patch(
  "/profile-image",
  authMiddleware,
  uploadMiddleware.single("profileImage"),
  asyncHandler(updateProfileImageController)
);

/**
 * DELETE = remove profile image
 */
router.delete(
  "/profile-image",
  authMiddleware,
  asyncHandler(deleteProfileImageController)
);

/**
 * Delete entire site settings.
 */
router.delete("/", authMiddleware, asyncHandler(deleteSettings));

export default router;
