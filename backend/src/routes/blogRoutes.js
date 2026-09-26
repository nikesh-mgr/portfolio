import express from "express";

import {
  createBlogController,
  getPublicBlogs,
  getAdminBlogs,
  getBlog,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
  uploadBlogCoverImageController,
  deleteBlogCoverImageController,
} from "../controllers/blogController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  createBlogSchema,
  updateBlogSchema,
  blogIdSchema,
  blogAdminIdSchema,
  blogSlugSchema,
} from "../validators/blogValidator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

/**
 * GET /api/blogs
 *
 * Returns published blogs only.
 *
 * IMPORTANT:
 * The public client cannot pass ?published=false to access drafts.
 */
router.get("/", asyncHandler(getPublicBlogs));

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

/**
 * GET /api/blogs/admin
 *
 * Returns all blogs, including unpublished/draft blogs.
 */
router.get("/admin", authMiddleware, asyncHandler(getAdminBlogs));

/**
 * GET /api/blogs/admin/:blogid
 *
 * Returns a single blog for the authenticated admin.
 */
router.get(
  "/admin/:blogid",
  authMiddleware,
  validate(blogAdminIdSchema, "params"),
  asyncHandler(getBlogByIdController)
);

/*
|--------------------------------------------------------------------------
| Blog Creation
|--------------------------------------------------------------------------
*/

/**
 * POST /api/blogs
 *
 * Creates the blog document.
 *
 * Cover image is intentionally NOT uploaded here.
 * Use:
 *
 * POST /api/blogs/:id/cover-image
 *
 * after the blog has been created.
 */
router.post(
  "/",
  authMiddleware,
  validate(createBlogSchema),
  asyncHandler(createBlogController)
);

/*
|--------------------------------------------------------------------------
| Blog Update
|--------------------------------------------------------------------------
*/

/**
 * PATCH /api/blogs/:id
 *
 * Updates normal blog fields.
 *
 * Cover image is managed separately.
 */
router.patch(
  "/:id",
  authMiddleware,
  validate(blogIdSchema, "params"),
  validate(updateBlogSchema),
  asyncHandler(updateBlogController)
);

/*
|--------------------------------------------------------------------------
| Blog Cover Image
|--------------------------------------------------------------------------
*/

/**
 * POST /api/blogs/:id/cover-image
 *
 * Upload or replace the blog cover image.
 *
 * Multer performs the file-level checks:
 * - allowed MIME types
 * - maximum file size
 * - upload limits
 */
router.post(
  "/:id/cover-image",
  authMiddleware,
  validate(blogIdSchema, "params"),
  uploadMiddleware.single("coverImage"),
  asyncHandler(uploadBlogCoverImageController)
);

/**
 * DELETE /api/blogs/:id/cover-image
 *
 * Removes the cover image from MongoDB and Cloudinary.
 */
router.delete(
  "/:id/cover-image",
  authMiddleware,
  validate(blogIdSchema, "params"),
  asyncHandler(deleteBlogCoverImageController)
);

/*
|--------------------------------------------------------------------------
| Delete Blog
|--------------------------------------------------------------------------
*/

/**
 * DELETE /api/blogs/:id
 */
router.delete(
  "/:id",
  authMiddleware,
  validate(blogIdSchema, "params"),
  asyncHandler(deleteBlogController)
);

/*
|--------------------------------------------------------------------------
| Public Blog By Slug
|--------------------------------------------------------------------------
*/

/**
 * GET /api/blogs/:slug
 *
 * Returns published blog content only.
 *
 * This route must remain after fixed routes such as:
 * /admin
 * /:id/cover-image
 *
 * so those paths are never treated as slugs.
 */
router.get("/:slug", validate(blogSlugSchema, "params"), asyncHandler(getBlog));

export default router;
