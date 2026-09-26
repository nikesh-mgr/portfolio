import mongoose from "mongoose";

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

const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [2, "Project title must be at least 2 characters"],
      maxlength: [100, "Project title cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [250, "Short description cannot exceed 250 characters"],
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [5000, "Project description cannot exceed 5000 characters"],
    },

    technologies: {
      type: [String],
      required: [true, "At least one technology is required"],
      validate: {
        validator: (technologies) =>
          Array.isArray(technologies) && technologies.length > 0,
        message: "At least one technology is required",
      },
    },

    category: {
      type: String,
      required: [true, "Project category is required"],
      trim: true,
      lowercase: true,
      maxlength: [50, "Category cannot exceed 50 characters"],
    },

    image: {
      url: {
        type: String,
        default: null,
        trim: true,
        validate: urlValidator,
      },

      publicId: {
        type: String,
        default: null,
        trim: true,
      },
    },

    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
            trim: true,
            validate: urlValidator,
          },

          publicId: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],

      default: [],
    },

    githubUrl: {
      type: String,
      default: null,
      trim: true,
      validate: urlValidator,
    },

    liveUrl: {
      type: String,
      default: null,
      trim: true,
      validate: urlValidator,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["completed", "in-progress", "planned"],
      default: "completed",
    },

    order: {
      type: Number,
      default: 0,
      min: [0, "Order cannot be negative"],
    },
    published: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

/**
 * Generate slug automatically before validation.
 *
 * Do not use next() here.
 */
projectSchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = createSlug(this.title);
  }
});

/**
 * Indexes.
 *
 * slug already has unique: true above.
 * Do not add another slug index.
 */
projectSchema.index({
  featured: 1,
  order: 1,
});

projectSchema.index({
  category: 1,
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
