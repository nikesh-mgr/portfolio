import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import resumeUploadMiddleware from "../middleware/resumeUploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadRateLimiter } from "../middleware/rateLimiter.js";

import {
  getResumeController,
  uploadResumeController,
  updateResumeController,
  deleteResumeController,
} from "../controllers/resumeController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

/**
 * GET /api/resume
 *
 * Get the currently active resume.
 */
router.get("/", asyncHandler(getResumeController));

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

/**
 * POST /api/resume
 *
 * Upload a new resume.
 */
router.post(
  "/",
authMiddleware,
  uploadRateLimiter,
  resumeUploadMiddleware.single("resume"),
  asyncHandler(uploadResumeController)
);

/**
 * PATCH /api/resume/:id
 *
 * Update resume metadata.
 */
router.patch("/:id", authMiddleware, asyncHandler(updateResumeController));

/**
 * DELETE /api/resume/:id
 *
 * Delete resume.
 */
router.delete("/:id", authMiddleware, asyncHandler(deleteResumeController));

export default router;
