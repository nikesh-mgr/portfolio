import express from "express";

import {
  createBlogController,
  getBlogs,
  getBlog,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
  uploadBlogCoverImageController,
  deleteBlogCoverImageController,
} from "../controllers/blogController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

/**
 * GET /api/blogs
 *
 * Default: published blogs
 */
router.get("/", asyncHandler(getBlogs));

/*
|--------------------------------------------------------------------------
| Admin routes
|--------------------------------------------------------------------------
*/

/**
 * GET /api/blogs/admin/:blogid
 */
router.get(
  "/admin/:blogid",
  authMiddleware,
  asyncHandler(getBlogByIdController)
);

/**
 * POST /api/blogs
 *
 * Optional:
 * featuredImage file
 */
router.post(
  "/",
  authMiddleware,
  uploadMiddleware.single("coverImage"),
  asyncHandler(createBlogController)
);

/**
 * PATCH /api/blogs/:id
 *
 * Optional:
 * coverImage file
 */
router.patch(
  "/:id",
  authMiddleware,
  uploadMiddleware.single("coverImage"),
  asyncHandler(updateBlogController)
);

/**
 * DELETE /api/blogs/:id
 */
router.delete("/:id", authMiddleware, asyncHandler(deleteBlogController));

/*
|--------------------------------------------------------------------------
| Blog cover image
|--------------------------------------------------------------------------
*/

/**
 * POST /api/blogs/:id/cover-image
 *
 * Upload or replace cover image.
 */
router.post(
  "/:id/cover-image",
  authMiddleware,
  uploadMiddleware.single("coverImage"),
  asyncHandler(uploadBlogCoverImageController)
);

/**
 * DELETE /api/blogs/:id/cover-image
 */
router.delete(
  "/:id/cover-image",
  authMiddleware,
  asyncHandler(deleteBlogCoverImageController)
);

/*
|--------------------------------------------------------------------------
| Public blog by slug
|--------------------------------------------------------------------------

*/
router.get("/:slug", asyncHandler(getBlog));

export default router;
