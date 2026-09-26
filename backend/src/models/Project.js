import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| URL validation
|--------------------------------------------------------------------------
|
| Only HTTP and HTTPS URLs are accepted.
|
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

/*
|--------------------------------------------------------------------------
| Slug generation
|--------------------------------------------------------------------------
|
| Example:
| "My Portfolio App" → "my-portfolio-app"
|
*/

const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
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

    /*
     * Unique project slug.
     */
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [120, "Project slug cannot exceed 120 characters"],
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

    /*
     * Technologies used by the project.
     */
    technologies: {
      type: [String],
      required: [true, "At least one technology is required"],

      validate: [
        {
          validator: (technologies) =>
            Array.isArray(technologies) &&
            technologies.length >= 1 &&
            technologies.length <= 30,

          message: "Project must contain between 1 and 30 technologies",
        },

        {
          validator: (technologies) =>
            technologies.every(
              (technology) =>
                typeof technology === "string" &&
                technology.trim().length >= 1 &&
                technology.trim().length <= 50
            ),

          message:
            "Each technology must be a non-empty string of at most 50 characters",
        },
      ],
    },

    category: {
      type: String,
      required: [true, "Project category is required"],
      trim: true,
      lowercase: true,
      maxlength: [50, "Category cannot exceed 50 characters"],
    },

    /*
     * Primary project image.
     */
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
        maxlength: [500, "Image public ID cannot exceed 500 characters"],
      },
    },

    /*
     * Additional project images.
     *
     * Maximum: 10
     */
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
            maxlength: [500, "Image public ID cannot exceed 500 characters"],
          },
        },
      ],

      default: [],

      validate: {
        validator: (images) => Array.isArray(images) && images.length <= 10,

        message: "A project cannot contain more than 10 additional images",
      },
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

    /*
     * Controls whether the project appears
     * in the Home featured section.
     */
    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["completed", "in-progress", "planned"],
      default: "completed",
    },

    /*
     * Controls project ordering.
     */
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

/*
|--------------------------------------------------------------------------
| Automatic slug generation
|--------------------------------------------------------------------------
*/

projectSchema.pre("validate", function () {
  if (this.isModified("title") && this.title) {
    const generatedSlug = createSlug(this.title);

    if (!generatedSlug) {
      this.invalidate(
        "slug",
        "Project title must contain at least one letter or number"
      );

      return;
    }

    this.slug = generatedSlug;
  }
});

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
|
| featured + order:
| Supports featured-project queries and ordering.
|
| category:
| Supports category filtering.
|
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
