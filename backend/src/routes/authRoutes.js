import express from "express";
import rateLimit from "express-rate-limit";
import setupMiddleware from "../middleware/setupMiddleware.js";
import resumeUploadMiddleware from "../middleware/resumeUploadMiddleware.js";

import {
  createAdminController,
  loginController,
  getCurrentAdminController,
  logoutController,
  updateAdminProfileImage,
  removeAdminProfileImage,
  deleteAdminResume,
  updateAdminResume,
} from "../controllers/authController.js";

import uploadMiddleware from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import validate from "../middleware/validateMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

import { createAdminSchema, loginSchema } from "../validators/authValidator.js";

const router = express.Router();

router.post(
  "/create-admin",
  setupMiddleware,
  validate(createAdminSchema),
  createAdminController
);

router.post(
  "/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
  validate(loginSchema),
  loginController
);

router.get("/me", authMiddleware, getCurrentAdminController);

router.post("/logout", logoutController);

/**
 * Update admin profile image.
 */
router.patch(
  "/profile/image",
  authMiddleware,
  uploadMiddleware.single("image"),
  asyncHandler(updateAdminProfileImage)
);
/** * Remove admin profile image. */ router.delete(
  "/profile/image",
  authMiddleware,
  asyncHandler(removeAdminProfileImage)
);
router.delete(
  "/profile/resume",
  authMiddleware,
  asyncHandler(deleteAdminResume)
);
router.patch(
  "/profile/resume",
  authMiddleware,
  resumeUploadMiddleware.single("resume"),
  asyncHandler(updateAdminResume)
);
export default router;
