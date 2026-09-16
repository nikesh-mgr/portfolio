import express from "express";

import {
  createProject,
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectImages,
  removeProjectImage,
} from "../controllers/projectController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

/**
 * Get all projects.
 *
 * Optional query:
 * ?published=true
 */
router.get("/", asyncHandler(getAllProjects));

/**
 * Get project by slug.
 *
 * Example:
 * GET /api/projects/slug/my-portfolio
 */
router.get("/slug/:slug", asyncHandler(getProjectBySlug));

/**
 * Get project by ID.
 *
 * Example:
 * GET /api/projects/65f123...
 */
router.get("/:id", asyncHandler(getProjectById));

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

/**
 * Create project.
 *
 * Content-Type:
 * multipart/form-data
 *
 * File field:
 * image
 */
router.post(
  "/",
  authMiddleware,
  uploadMiddleware.single("image"),
  asyncHandler(createProject)
);

/**
 * Update project.
 *
 * Content-Type:
 * multipart/form-data
 *
 * File field:
 * image
 */
router.patch(
  "/:id",
  authMiddleware,
  uploadMiddleware.single("image"),
  asyncHandler(updateProject)
);

/**
 * Delete project.
 */
router.delete("/:id", authMiddleware, asyncHandler(deleteProject));

/**
 * Add project gallery images.
 *
 * Field name:
 * images
 */
router.post(
  "/:id/images",
  authMiddleware,
  uploadMiddleware.array("images", 10),
  asyncHandler(addProjectImages)
);

/**
 * Remove a project gallery image.
 */
router.delete("/:id/images", authMiddleware, asyncHandler(removeProjectImage));
export default router;
