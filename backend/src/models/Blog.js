import mongoose from "mongoose";

/**
 * Create a URL-friendly slug from text.
 */
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/**
 * Validate HTTP/HTTPS URLs.
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

    slug: {
      type: String,
      required: [true, "Blog slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: [true, "Blog excerpt is required"],
      trim: true,
      maxlength: [300, "Blog excerpt cannot exceed 300 characters"],
    },

    content: {
      type: String,
      required: [true, "Blog content is required"],
      trim: true,
      minlength: [20, "Blog content must be at least 20 characters"],
    },

    /**
     * Blog cover image.
     *
     * Cloudinary URL + public ID are stored
     * so the image can be replaced or deleted.
     */
    coverImage: {
      url: {
        type: String,
        trim: true,
        default: null,
        validate: urlValidator,
      },

      publicId: {
        type: String,
        trim: true,
        default: null,
      },
    },

    tags: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [50, "Category cannot exceed 50 characters"],
      default: null,
    },

    published: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    readingTime: {
      type: Number,
      default: 1,
      min: [1, "Reading time must be at least 1 minute"],
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
      },

      canonicalUrl: {
        type: String,
        trim: true,
        default: null,
        validate: urlValidator,
      },
    },

    order: {
      type: Number,
      default: 0,
      min: [0, "Order cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Automatically generate slug from title.
 */
blogSchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = createSlug(this.title);
  }
});

/**
 * Automatically manage publishedAt.
 */
blogSchema.pre("save", function () {
  if (this.isModified("published")) {
    if (this.published && !this.publishedAt) {
      this.publishedAt = new Date();
    }

    if (!this.published) {
      this.publishedAt = null;
    }
  }
});

/**
 * Indexes.
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
