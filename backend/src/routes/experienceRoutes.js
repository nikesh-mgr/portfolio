import express from "express";

import {
  createExperienceController,
  getExperiences,
  getExperience,
  updateExperienceController,
  deleteExperienceController,
} from "../controllers/experienceController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

/**
 * Public routes.
 */
router.get("/", asyncHandler(getExperiences));

router.get("/:id", asyncHandler(getExperience));

/**
 * Admin routes.
 */
router.post(
  "/",
  authMiddleware,
  uploadMiddleware.single("companyLogo"),
  asyncHandler(createExperienceController)
);

router.patch(
  "/:id",
  authMiddleware,
  uploadMiddleware.single("companyLogo"),
  asyncHandler(updateExperienceController)
);

router.delete("/:id", authMiddleware, asyncHandler(deleteExperienceController));

export default router;
