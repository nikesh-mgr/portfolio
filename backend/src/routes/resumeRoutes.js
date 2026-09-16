import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import resumeUploadMiddleware from "../middleware/resumeUploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

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
 */
router.get("/", asyncHandler(getResumeController));

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

/**
 * POST /api/resume
 */
router.post(
  "/",
  authMiddleware,
  resumeUploadMiddleware.single("resume"),
  asyncHandler(uploadResumeController)
);

/**
 * PATCH /api/resume/:id
 */
router.patch("/:id", authMiddleware, asyncHandler(updateResumeController));

/**
 * DELETE /api/resume/:id
 */
router.delete("/:id", authMiddleware, asyncHandler(deleteResumeController));

export default router;
