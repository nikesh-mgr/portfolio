import mongoose from "mongoose";

import Blog from "../models/Blog.js";

import ApiError from "../utils/ApiError.js";

/**
 * Fields allowed to be changed through the normal blog update endpoint.
 *
 * coverImage is intentionally excluded because image management has
 * dedicated Cloudinary endpoints.
 */
const allowedUpdateFields = [
  "title",
  "excerpt",
  "content",
  "tags",
  "category",
  "published",
  "readingTime",
  "seo",
  "order",
];

/**
 * Validate MongoDB ObjectId values consistently.
 */
const validateBlogId = (blogId) => {
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    throw new ApiError(400, "Invalid blog ID");
  }
};

/**
 * Handle MongoDB unique-index conflicts.
 *
 * The pre-checks below improve the normal error message, while this
 * handler protects against race conditions between two requests.
 */
const handleDuplicateKeyError = (error) => {
  if (error?.code !== 11000) {
    throw error;
  }

  const duplicateField = Object.keys(error.keyPattern || {})[0];

  if (duplicateField === "slug") {
    throw new ApiError(409, "A blog with this slug already exists");
  }

  throw new ApiError(
    409,
    "A blog with the provided information already exists"
  );
};

/**
 * Create a new blog.
 *
 * Cover image is intentionally handled by the dedicated
 * POST /:id/cover-image endpoint.
 */
export const createBlog = async (blogData) => {
  const { title, slug } = blogData;

  const duplicateConditions = [];

  if (title) {
    duplicateConditions.push({ title });
  }

  if (slug) {
    duplicateConditions.push({ slug });
  }

  if (duplicateConditions.length > 0) {
    const existingBlog = await Blog.findOne({
      $or: duplicateConditions,
    }).select("title slug");

    if (existingBlog) {
      if (title && existingBlog.title === title) {
        throw new ApiError(409, "A blog with this title already exists");
      }

      if (slug && existingBlog.slug === slug) {
        throw new ApiError(409, "A blog with this slug already exists");
      }
    }
  }

  try {
    const blog = await Blog.create({
      ...blogData,

      // Never allow normal blog creation to inject image metadata.
      coverImage: {
        url: null,
        publicId: null,
      },
    });

    return blog;
  } catch (error) {
    handleDuplicateKeyError(error);
  }
};

/**
 * Get all blogs.
 *
 * publishedOnly=true is used for public requests.
 */
export const getAllBlogs = async ({ publishedOnly = false } = {}) => {
  const filter = publishedOnly ? { published: true } : {};

  return Blog.find(filter)
    .sort({
      publishedAt: -1,
      createdAt: -1,
    })
    .lean();
};

/**
 * Get a blog by slug.
 */
export const getBlogBySlug = async (slug) => {
  if (!slug || typeof slug !== "string") {
    throw new ApiError(400, "Blog slug is required");
  }

  const blog = await Blog.findOne({
    slug: slug.trim().toLowerCase(),
  });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return blog;
};

/**
 * Get a blog by MongoDB ID.
 */
export const getBlogById = async (blogId) => {
  validateBlogId(blogId);

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return blog;
};

/**
 * Update normal blog information.
 *
 * Cover image is deliberately excluded.
 */
export const updateBlog = async (blogId, blogData) => {
  validateBlogId(blogId);

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  /**
   * Whitelist fields rather than assigning arbitrary request data
   * directly to the Mongoose document.
   */
  const safeBlogData = {};

  for (const field of allowedUpdateFields) {
    if (Object.prototype.hasOwnProperty.call(blogData, field)) {
      safeBlogData[field] = blogData[field];
    }
  }

  /**
   * Explicitly reject coverImage if it somehow reaches the service.
   *
   * This protects the service even when called outside the normal
   * validated HTTP route.
   */
  if (
    Object.prototype.hasOwnProperty.call(blogData, "coverImage") &&
    blogData.coverImage !== undefined
  ) {
    throw new ApiError(
      400,
      "Cover image must be managed through the cover-image endpoint"
    );
  }

  /**
   * Title uniqueness.
   *
   * Slug is generated from the title by the model hook.
   */
  if (safeBlogData.title && safeBlogData.title !== blog.title) {
    const existingBlog = await Blog.findOne({
      title: safeBlogData.title,
      _id: { $ne: blogId },
    }).select("_id");

    if (existingBlog) {
      throw new ApiError(409, "A blog with this title already exists");
    }
  }

  Object.assign(blog, safeBlogData);

  try {
    await blog.save();
  } catch (error) {
    handleDuplicateKeyError(error);
  }

  return blog;
};

/**
 * Update blog cover image metadata.
 *
 * The actual Cloudinary upload is performed by the controller.
 */
export const updateBlogCoverImage = async (blogId, coverImage) => {
  validateBlogId(blogId);

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (!coverImage || typeof coverImage !== "object") {
    throw new ApiError(400, "Invalid cover image data");
  }

  if (
    typeof coverImage.url !== "string" ||
    !coverImage.url.trim() ||
    typeof coverImage.publicId !== "string" ||
    !coverImage.publicId.trim()
  ) {
    throw new ApiError(400, "Invalid cover image data");
  }

  /**
   * Only store valid HTTP/HTTPS Cloudinary URLs.
   */
  try {
    const url = new URL(coverImage.url);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error();
    }
  } catch {
    throw new ApiError(400, "Invalid cover image URL");
  }

  blog.coverImage = {
    url: coverImage.url.trim(),
    publicId: coverImage.publicId.trim(),
  };

  await blog.save();

  return blog;
};

/**
 * Remove the cover image reference from MongoDB.
 *
 * Cloudinary deletion is intentionally handled separately by
 * the controller so database and external-file cleanup remain explicit.
 */
export const removeBlogCoverImage = async (blogId) => {
  validateBlogId(blogId);

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  blog.coverImage = {
    url: null,
    publicId: null,
  };

  await blog.save();

  return blog;
};

/**
 * Delete a blog document.
 *
 * The controller is responsible for deleting the associated
 * Cloudinary asset after the database deletion succeeds.
 */
export const deleteBlog = async (blogId) => {
  validateBlogId(blogId);

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  await blog.deleteOne();

  return {
    id: blog._id,
  };
};
