import express from "express";

import {
  createAdminController,
  loginController,
  getCurrentAdminController,
  logoutController,
  updateAdminProfileImage,
  removeAdminProfileImage,
  deleteAdminResume,
} from "../controllers/authController.js";

import uploadMiddleware from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import validate from "../middleware/validateMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

import { createAdminSchema, loginSchema } from "../validators/authValidator.js";

const router = express.Router();

router.post(
  "/create-admin",
  validate(createAdminSchema),
  createAdminController
);

router.post("/login", validate(loginSchema), loginController);

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
export default router;
