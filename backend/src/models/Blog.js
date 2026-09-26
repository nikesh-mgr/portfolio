import mongoose from "mongoose";

/**
 * Create a URL-friendly slug from a title.
 *
 * Keeping slug generation on the server prevents the client
 * from controlling the final canonical slug format.
 */
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Validate HTTP/HTTPS URLs.
 *
 * This is intentionally limited to web URLs.
 * javascript:, data:, file:, etc. are rejected.
 */
const urlValidator = {
  validator: (value) => {
    if (!value) return true;

    try {
      const url = new URL(value);

      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  },

  message: "Please provide a valid HTTP or HTTPS URL",
};

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: [3, "Blog title must be at least 3 characters"],
      maxlength: [200, "Blog title cannot exceed 200 characters"],
    },

    /**
     * Slug is generated from the title by the pre-validation hook.
     */
    slug: {
      type: String,
      required: [true, "Blog slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [1, "Blog slug cannot be empty"],
      maxlength: [220, "Blog slug cannot exceed 220 characters"],
    },

    excerpt: {
      type: String,
      required: [true, "Blog excerpt is required"],
      trim: true,
      minlength: [10, "Blog excerpt must be at least 10 characters"],
      maxlength: [300, "Blog excerpt cannot exceed 300 characters"],
    },

    /**
     * Blog content may contain formatted HTML/Markdown depending
     * on the editor used by the frontend.
     *
     * IMPORTANT:
     * Content must be sanitized before rendering as HTML.
     */
    content: {
      type: String,
      required: [true, "Blog content is required"],
      trim: true,
      minlength: [20, "Blog content must be at least 20 characters"],
      maxlength: [100000, "Blog content cannot exceed 100000 characters"],
    },

    /**
     * Cloudinary cover image metadata.
     *
     * Both URL and publicId are stored because:
     * - url is used by the frontend
     * - publicId is required for Cloudinary deletion/replacement
     */
    coverImage: {
      url: {
        type: String,
        trim: true,
        default: null,
        maxlength: [2048, "Cover image URL cannot exceed 2048 characters"],
        validate: urlValidator,
      },

      publicId: {
        type: String,
        trim: true,
        default: null,
        maxlength: [500, "Cover image public ID cannot exceed 500 characters"],
      },
    },

    /**
     * Blog tags.
     *
     * Limits prevent unexpectedly large documents and
     * unbounded user-controlled array values.
     */
    tags: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (tags) => Array.isArray(tags) && tags.length <= 20,
          message: "A blog cannot contain more than 20 tags",
        },
        {
          validator: (tags) =>
            tags.every(
              (tag) =>
                typeof tag === "string" &&
                tag.trim().length >= 1 &&
                tag.trim().length <= 50
            ),
          message: "Each blog tag must be 1 to 50 characters",
        },
      ],
    },

    category: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [2, "Blog category must be at least 2 characters"],
      maxlength: [50, "Category cannot exceed 50 characters"],
      default: null,
    },

    published: {
      type: Boolean,
      default: false,
    },

    /**
     * Automatically assigned when a blog is published.
     */
    publishedAt: {
      type: Date,
      default: null,
    },

    readingTime: {
      type: Number,
      default: 1,
      min: [1, "Reading time must be at least 1 minute"],
      max: [120, "Reading time cannot exceed 120 minutes"],
    },

    seo: {
      metaTitle: {
        type: String,
        trim: true,
        maxlength: [70, "SEO meta title cannot exceed 70 characters"],
        default: null,
      },

      metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, "SEO meta description cannot exceed 160 characters"],
        default: null,
      },

      keywords: {
        type: [String],
        default: [],
        validate: [
          {
            validator: (keywords) =>
              Array.isArray(keywords) && keywords.length <= 30,
            message: "SEO cannot contain more than 30 keywords",
          },
          {
            validator: (keywords) =>
              keywords.every(
                (keyword) =>
                  typeof keyword === "string" &&
                  keyword.trim().length >= 1 &&
                  keyword.trim().length <= 50
              ),
            message: "Each SEO keyword must be 1 to 50 characters",
          },
        ],
      },

      canonicalUrl: {
        type: String,
        trim: true,
        default: null,
        maxlength: [2048, "Canonical URL cannot exceed 2048 characters"],
        validate: urlValidator,
      },
    },

    order: {
      type: Number,
      default: 0,
      min: [0, "Order cannot be negative"],
      max: [1000000, "Order cannot exceed 1000000"],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Generate the slug from the title.
 */
blogSchema.pre("validate", function () {
  if (this.isModified("title") && this.title) {
    const generatedSlug = createSlug(this.title);

    if (!generatedSlug) {
      this.invalidate(
        "slug",
        "Blog title must contain at least one letter or number"
      );

      return;
    }

    this.slug = generatedSlug;
  }
});

/**
 * Automatically manage publishedAt.
 *
 * Publishing:
 *   false -> true
 *   assigns the current timestamp.
 *
 * Unpublishing:
 *   true -> false
 *   clears publishedAt.
 */
blogSchema.pre("save", function () {
  if (!this.isModified("published")) {
    return;
  }

  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  if (!this.published) {
    this.publishedAt = null;
  }
});

/**
 * Query indexes.
 */
blogSchema.index({
  published: 1,
  publishedAt: -1,
});

blogSchema.index({
  category: 1,
});

blogSchema.index({
  tags: 1,
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
