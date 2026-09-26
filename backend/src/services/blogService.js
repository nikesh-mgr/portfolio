import mongoose from "mongoose";

import Blog from "../models/Blog.js";

import ApiError from "../utils/apiError.js";

/**
 * Create a new blog.
 */
export const createBlog = async (blogData) => {
  const { title, slug } = blogData;

  /*
   * Check duplicate title or slug.
   */
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
    });

    if (existingBlog) {
      if (title && existingBlog.title === title) {
        throw new ApiError(409, "A blog with this title already exists");
      }

      if (slug && existingBlog.slug === slug) {
        throw new ApiError(409, "A blog with this slug already exists");
      }
    }
  }

  /*
   * Create blog.
   *
   * Cover image is intentionally handled
   * by the dedicated cover-image endpoint.
   */
  const blog = await Blog.create({
    ...blogData,

    coverImage: {
      url: null,
      publicId: null,
    },
  });

  return blog;
};

/**
 * Get all blogs.
 */
export const getAllBlogs = async ({ publishedOnly = false } = {}) => {
  const filter = publishedOnly ? { published: true } : {};

  const blogs = await Blog.find(filter)
    .sort({
      publishedAt: -1,
      createdAt: -1,
    })
    .lean();

  return blogs;
};

/**
 * Get blog by slug.
 */
export const getBlogBySlug = async (slug) => {
  const blog = await Blog.findOne({
    slug,
  });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return blog;
};

/**
 * Get blog by ID.
 */
export const getBlogById = async (blogId) => {
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    throw new ApiError(400, "Invalid blog ID");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return blog;
};

/**
 * Update a blog.
 *
 * Cover image is NOT updated here.
 * Use updateBlogCoverImage() instead.
 */
export const updateBlog = async (blogId, blogData) => {
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    throw new ApiError(400, "Invalid blog ID");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  /*
   * Prevent coverImage from being
   * accidentally overwritten through
   * the normal blog update endpoint.
   */
  const safeBlogData = { ...blogData };
  delete safeBlogData.coverImage;

  /*
   * Check duplicate title.
   */
  if (safeBlogData.title && safeBlogData.title !== blog.title) {
    const existingBlog = await Blog.findOne({
      title: safeBlogData.title,
      _id: {
        $ne: blogId,
      },
    });

    if (existingBlog) {
      throw new ApiError(409, "A blog with this title already exists");
    }
  }

  /*
   * Check duplicate slug.
   */
  if (safeBlogData.slug && safeBlogData.slug !== blog.slug) {
    const existingBlog = await Blog.findOne({
      slug: safeBlogData.slug,
      _id: {
        $ne: blogId,
      },
    });

    if (existingBlog) {
      throw new ApiError(409, "A blog with this slug already exists");
    }
  }

  /*
   * Apply normal blog fields.
   */
  Object.assign(blog, safeBlogData);

  await blog.save();

  return blog;
};

/**
 * Update blog cover image.
 *
 * Expected:
 *
 * {
 *   url: "https://...",
 *   publicId: "portfolio/blogs/..."
 * }
 */
export const updateBlogCoverImage = async (blogId, coverImage) => {
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    throw new ApiError(400, "Invalid blog ID");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  /*
   * Validate image object.
   */
  if (!coverImage || typeof coverImage !== "object") {
    throw new ApiError(400, "Invalid cover image data");
  }

  /*
   * Save Cloudinary information.
   */
  blog.coverImage = {
    url: coverImage.url || null,

    publicId: coverImage.publicId || null,
  };

  await blog.save();

  return blog;
};

/**
 * Remove blog cover image reference
 * from MongoDB.
 *
 * Cloudinary deletion is handled
 * separately by the controller.
 */
export const removeBlogCoverImage = async (blogId) => {
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    throw new ApiError(400, "Invalid blog ID");
  }

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
 * Delete blog.
 */
export const deleteBlog = async (blogId) => {
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    throw new ApiError(400, "Invalid blog ID");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  await blog.deleteOne();

  return {
    id: blog._id,
  };
};
