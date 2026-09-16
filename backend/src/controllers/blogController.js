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

import ApiError from "../utils/apiError.js";

/*
|--------------------------------------------------------------------------
| Create Blog
|--------------------------------------------------------------------------
*/

/**
 * Create a new blog.
 *
 * The blog itself is created first.
 * Cover image is uploaded separately using:
 *
 * POST /api/blogs/:id/cover-image
 */
export const createBlogController = async (req, res) => {
  const blogData = {
    ...req.body,
  };

  const blog = await createBlog(blogData);

  res.status(201).json({
    success: true,

    message: "Blog created successfully",

    blog,
  });
};

/*
|--------------------------------------------------------------------------
| Get Blogs
|--------------------------------------------------------------------------
*/

/**
 * Get all blogs.
 *
 * Public:
 * published blogs only.
 *
 * Admin:
 * ?published=false
 */
export const getBlogs = async (req, res) => {
  const publishedOnly = req.query.published !== "false";

  const blogs = await getAllBlogs({
    publishedOnly,
  });

  res.status(200).json({
    success: true,

    count: blogs.length,

    blogs,
  });
};

/*
|--------------------------------------------------------------------------
| Get Blog By Slug
|--------------------------------------------------------------------------
*/

/**
 * Get published blog by slug.
 */
export const getBlog = async (req, res) => {
  const blog = await getBlogBySlug(req.params.slug);

  /*
   * Do not expose unpublished blogs
   * publicly.
   */
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
| Get Blog By ID
|--------------------------------------------------------------------------
*/

/**
 * Get blog by ID.
 *
 * Admin only.
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
 * Cover image is handled separately.
 */
export const updateBlogController = async (req, res) => {
  console.log("========================================");

  console.log("UPDATE BLOG CONTROLLER");

  console.log("BLOG ID:", req.params.id);

  console.log("BODY:", req.body);

  console.log("FILE:", req.file);

  console.log("========================================");

  const blogData = {
    ...req.body,
  };

  const blog = await updateBlog(req.params.id, blogData);

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
 * Upload or replace blog cover image.
 *
 * POST /api/blogs/:id/cover-image
 *
 * FormData:
 *
 * coverImage: File
 */
export const uploadBlogCoverImageController = async (req, res) => {
  let uploadedImage = null;

  try {
    console.log("========================================");

    console.log("BLOG COVER IMAGE UPLOAD");

    console.log("BLOG ID:", req.params.id);

    console.log("FILE:", req.file);

    console.log("BODY:", req.body);

    console.log("========================================");

    /*
     * Multer must receive the file.
     */
    if (!req.file) {
      throw new ApiError(400, "Cover image file is required");
    }

    /*
     * Validate blog ID and retrieve
     * existing blog.
     */
    const existingBlog = await getBlogById(req.params.id);

    console.log("EXISTING COVER:", existingBlog.coverImage);

    /*
     * Upload file buffer to Cloudinary.
     */
    console.log("UPLOADING TO CLOUDINARY...");

    uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      "portfolio/blogs",
      "image"
    );

    console.log("CLOUDINARY RESULT:", uploadedImage);

    /*
     * Verify Cloudinary response.
     */
    if (!uploadedImage?.secure_url || !uploadedImage?.public_id) {
      throw new ApiError(500, "Cloudinary upload failed");
    }

    /*
     * Build database object.
     */
    const coverImage = {
      url: uploadedImage.secure_url,

      publicId: uploadedImage.public_id,
    };

    console.log("COVER IMAGE TO SAVE:", coverImage);

    /*
     * Save new Cloudinary information
     * to MongoDB.
     */
    const blog = await updateBlogCoverImage(req.params.id, coverImage);

    console.log("BLOG AFTER UPDATE:", blog);

    /*
     * Delete old Cloudinary image
     * AFTER MongoDB update succeeds.
     */
    const oldPublicId = existingBlog.coverImage?.publicId;

    if (oldPublicId && oldPublicId !== coverImage.publicId) {
      console.log("DELETING OLD IMAGE:", oldPublicId);

      try {
        await deleteFromCloudinary(oldPublicId, "image");
      } catch (error) {
        /*
         * Do not fail the request because
         * old image cleanup failed.
         */
        console.error("FAILED TO DELETE OLD IMAGE:", error);
      }
    }

    res.status(200).json({
      success: true,

      message: "Blog cover image uploaded successfully",

      blog,
    });
  } catch (error) {
    console.error("BLOG COVER IMAGE ERROR:", error);

    /*
     * If Cloudinary upload succeeded
     * but MongoDB update failed, remove
     * the newly uploaded image.
     */
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id, "image");
      } catch (cleanupError) {
        console.error("FAILED TO CLEANUP NEW IMAGE:", cleanupError);
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
 * Delete blog cover image.
 *
 * DELETE /api/blogs/:id/cover-image
 */
export const deleteBlogCoverImageController = async (req, res) => {
  /*
   * Get existing blog.
   */
  const blog = await getBlogById(req.params.id);

  const publicId = blog.coverImage?.publicId;

  /*
   * If there is no image, return
   * a proper 404.
   */
  if (!publicId) {
    throw new ApiError(404, "Blog cover image not found");
  }

  /*
   * First remove database reference.
   */
  await removeBlogCoverImage(req.params.id);

  /*
   * Then remove image from Cloudinary.
   */
  try {
    await deleteFromCloudinary(publicId, "image");
  } catch (error) {
    /*
     * MongoDB is already updated.
     * Log Cloudinary cleanup failure
     * instead of failing the request.
     */
    console.error("FAILED TO DELETE CLOUDINARY IMAGE:", error);
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
 * Delete blog and its cover image.
 *
 * DELETE /api/blogs/:id
 */
export const deleteBlogController = async (req, res) => {
  /*
   * Get blog before deleting it so
   * we can get its Cloudinary public ID.
   */
  const blog = await getBlogById(req.params.id);

  const publicId = blog.coverImage?.publicId;

  /*
   * Delete MongoDB document.
   */
  await deleteBlog(req.params.id);

  /*
   * Delete Cloudinary image.
   */
  if (publicId) {
    try {
      await deleteFromCloudinary(publicId, "image");
    } catch (error) {
      console.error("FAILED TO DELETE BLOG COVER:", error);
    }
  }

  res.status(200).json({
    success: true,

    message: "Blog deleted successfully",
  });
};
