import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  updateBlogCoverImage,
  removeBlogCoverImage,
  deleteBlog,
} from "../services/blogService.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";

import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Create Blog
|--------------------------------------------------------------------------
*/

/**
 * Create a new blog.
 *
 * Cover image is intentionally handled separately through:
 *
 * POST /api/blogs/:id/cover-image
 *
 * This keeps normal blog data and external file management separate.
 */
export const createBlogController = async (req, res) => {
  const blog = await createBlog(req.body);

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    blog,
  });
};

/*
|--------------------------------------------------------------------------
| Public Blog Listing
|--------------------------------------------------------------------------
*/

/**
 * Get published blogs for the public website.
 *
 * IMPORTANT:
 * This controller does not accept a client-controlled published flag.
 * Public users must never be able to request drafts.
 */
export const getPublicBlogs = async (req, res) => {
  const blogs = await getAllBlogs({
    publishedOnly: true,
  });

  res.status(200).json({
    success: true,
    count: blogs.length,
    blogs,
  });
};

/*
|--------------------------------------------------------------------------
| Admin Blog Listing
|--------------------------------------------------------------------------
*/

/**
 * Get all blogs for the authenticated admin.
 *
 * Includes:
 * - published blogs
 * - unpublished/draft blogs
 */
export const getAdminBlogs = async (req, res) => {
  const blogs = await getAllBlogs({
    publishedOnly: false,
  });

  res.status(200).json({
    success: true,
    count: blogs.length,
    blogs,
  });
};

/*
|--------------------------------------------------------------------------
| Public Blog By Slug
|--------------------------------------------------------------------------
*/

/**
 * Get a published blog by slug.
 *
 * Unpublished blogs intentionally return 404 so that draft content
 * cannot be discovered through the public endpoint.
 */
export const getBlog = async (req, res) => {
  const blog = await getBlogBySlug(req.params.slug);

  if (!blog.published) {
    throw new ApiError(404, "Blog not found");
  }

  res.status(200).json({
    success: true,
    blog,
  });
};

/*
|--------------------------------------------------------------------------
| Admin Blog By ID
|--------------------------------------------------------------------------
*/

/**
 * Get a single blog by ID.
 *
 * This endpoint is protected by authMiddleware in the route.
 * Therefore it may return both published and unpublished blogs.
 */
export const getBlogByIdController = async (req, res) => {
  const blog = await getBlogById(req.params.blogid);

  res.status(200).json({
    success: true,
    blog,
  });
};

/*
|--------------------------------------------------------------------------
| Update Blog
|--------------------------------------------------------------------------
*/

/**
 * Update normal blog information.
 *
 * Cover image is deliberately excluded from this operation.
 * Use the dedicated cover-image endpoint instead.
 */
export const updateBlogController = async (req, res) => {
  const blog = await updateBlog(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    blog,
  });
};

/*
|--------------------------------------------------------------------------
| Upload / Replace Cover Image
|--------------------------------------------------------------------------
*/

/**
 * Upload or replace a blog cover image.
 *
 * Flow:
 *
 * 1. Validate uploaded file.
 * 2. Load existing blog.
 * 3. Remember old Cloudinary publicId.
 * 4. Upload new image.
 * 5. Save new image metadata to MongoDB.
 * 6. Delete old Cloudinary image.
 *
 * If Cloudinary succeeds but MongoDB fails, the newly uploaded
 * Cloudinary image is deleted to prevent an orphaned asset.
 */
export const uploadBlogCoverImageController = async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Cover image file is required");
  }

  /*
   * Retrieve the blog before uploading so:
   * - invalid IDs are rejected early
   * - missing blogs do not create orphaned Cloudinary images
   * - the previous publicId is available for cleanup
   */
  const existingBlog = await getBlogById(req.params.id);

  const oldPublicId = existingBlog.coverImage?.publicId;

  let uploadedImage = null;
  let databaseUpdated = false;

  try {
    /*
     * Upload the image to the dedicated blog folder.
     */
    uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      "portfolio/blogs",
      "image"
    );

    /*
     * Cloudinary must return both values required by the database.
     */
    if (!uploadedImage?.secure_url || !uploadedImage?.public_id) {
      throw new ApiError(500, "Cloudinary upload failed");
    }

    const coverImage = {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    };

    /*
     * Store the new Cloudinary metadata in MongoDB.
     */
    const blog = await updateBlogCoverImage(req.params.id, coverImage);

    /*
     * From this point onward, the new image is referenced by MongoDB.
     *
     * Therefore it must NOT be deleted by the outer cleanup handler.
     */
    databaseUpdated = true;

    /*
     * Delete the previous image only after the DB update succeeds.
     */
    if (oldPublicId && oldPublicId !== coverImage.publicId) {
      try {
        await deleteFromCloudinary(oldPublicId, "image");
      } catch (error) {
        /*
         * The blog is already correctly pointing to the new image.
         * Old-image cleanup can be retried separately if necessary.
         */
        console.error("Failed to delete old blog cover image:", error);
      }
    }

    res.status(200).json({
      success: true,
      message: "Blog cover image uploaded successfully",
      blog,
    });
  } catch (error) {
    /*
     * If Cloudinary upload succeeded but MongoDB update failed,
     * remove the newly uploaded image.
     *
     * If MongoDB already succeeded, do NOT remove it.
     */
    if (uploadedImage?.public_id && !databaseUpdated) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id, "image");
      } catch (cleanupError) {
        console.error(
          "Failed to cleanup newly uploaded blog image:",
          cleanupError
        );
      }
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Delete Cover Image
|--------------------------------------------------------------------------
*/

/**
 * Delete the current blog cover image.
 *
 * Database reference is removed first.
 * Cloudinary cleanup is performed afterwards.
 */
export const deleteBlogCoverImageController = async (req, res) => {
  const blog = await getBlogById(req.params.id);

  const publicId = blog.coverImage?.publicId;

  if (!publicId) {
    throw new ApiError(404, "Blog cover image not found");
  }

  /*
   * Remove the database reference first.
   */
  await removeBlogCoverImage(req.params.id);

  /*
   * Remove the external Cloudinary asset.
   */
  try {
    await deleteFromCloudinary(publicId, "image");
  } catch (error) {
    /*
     * MongoDB is already updated, so do not report the request
     * as failed simply because external cleanup failed.
     */
    console.error("Failed to delete Cloudinary blog cover image:", error);
  }

  res.status(200).json({
    success: true,
    message: "Blog cover image deleted successfully",
  });
};

/*
|--------------------------------------------------------------------------
| Delete Blog
|--------------------------------------------------------------------------
*/

/**
 * Delete a blog and its cover image.
 *
 * MongoDB deletion happens first.
 * Cloudinary cleanup happens afterwards.
 */
export const deleteBlogController = async (req, res) => {
  /*
   * Retrieve the blog before deletion so we can preserve
   * its Cloudinary publicId.
   */
  const blog = await getBlogById(req.params.id);

  const publicId = blog.coverImage?.publicId;

  /*
   * Delete the MongoDB document.
   */
  await deleteBlog(req.params.id);

  /*
   * Delete the associated Cloudinary asset.
   */
  if (publicId) {
    try {
      await deleteFromCloudinary(publicId, "image");
    } catch (error) {
      /*
       * The blog no longer exists in MongoDB.
       * External cleanup failure should not turn this into
       * a false-negative API response.
       */
      console.error("Failed to delete Cloudinary blog cover image:", error);
    }
  }

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
};
