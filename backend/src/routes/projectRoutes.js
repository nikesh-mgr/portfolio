import express from "express";

import {
  createProject,
  getAllProjects,
  getFeaturedProjects,
  getAllAdminProjects,
  getProjectBySlug,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectImages,
  removeProjectImage,
} from "../controllers/projectController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

import {
  createProjectSchema,
  updateProjectSchema,
  removeProjectImageSchema,
} from "../validators/projectValidator.js";

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
 * Used by:
 * - Projects page
 *
 * Returns:
 * - featured projects
 * - non-featured projects
 *
 * GET /api/projects
 */
router.get("/", asyncHandler(getAllProjects));

/**
 * Get featured projects.
 *
 * Used by:
 * - Home page
 *
 * Returns only:
 * featured === true
 *
 * GET /api/projects/featured
 *
 * IMPORTANT:
 * This must be before /:id.
 */
router.get("/featured", asyncHandler(getFeaturedProjects));

/**
 * Get project by slug.
 *
 * Example:
 * GET /api/projects/slug/my-portfolio
 */
router.get("/slug/:slug", asyncHandler(getProjectBySlug));

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

/**
 * Get all projects for admin.
 *
 * Returns:
 * - featured
 * - non-featured
 * - all project statuses
 *
 * GET /api/projects/admin/all
 */
router.get("/admin/all", authMiddleware, asyncHandler(getAllAdminProjects));

/**
 * Create project.
 *
 * Content-Type:
 * multipart/form-data
 *
 * Fields:
 * - title
 * - shortDescription
 * - description
 * - technologies
 * - category
 * - githubUrl
 * - liveUrl
 * - featured
 * - status
 * - order
 *
 * File:
 * - image
 */
router.post(
  "/",
  authMiddleware,
  uploadMiddleware.single("image"),
  validate(createProjectSchema),
  asyncHandler(createProject)
);

/**
 * Update project.
 *
 * Content-Type:
 * multipart/form-data
 *
 * File:
 * - image
 */
router.patch(
  "/:id",
  authMiddleware,
  uploadMiddleware.single("image"),
  validate(updateProjectSchema),
  asyncHandler(updateProject)
);

/**
 * Delete project.
 */
router.delete("/:id", authMiddleware, asyncHandler(deleteProject));

/**
 * Add project gallery images.
 *
 * Field:
 * - images
 *
 * Maximum:
 * - 10 files per request
 */
router.post(
  "/:id/images",
  authMiddleware,
  uploadMiddleware.array("images", 10),
  asyncHandler(addProjectImages)
);

/**
 * Remove project gallery image.
 */
router.delete(
  "/:id/images",
  authMiddleware,
  validate(removeProjectImageSchema),
  asyncHandler(removeProjectImage)
);

/*
|--------------------------------------------------------------------------
| Public Project By ID
|--------------------------------------------------------------------------
|
| This route is intentionally after /featured and /admin/all.
|
*/

router.get("/:id", asyncHandler(getProjectById));

export default router;
