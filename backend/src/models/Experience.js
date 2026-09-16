import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: [2, "Company name must be at least 2 characters"],
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },

    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      minlength: [2, "Position must be at least 2 characters"],
      maxlength: [150, "Position cannot exceed 150 characters"],
    },

    location: {
      type: String,
      default: null,
      trim: true,
      maxlength: [150, "Location cannot exceed 150 characters"],
    },

    employmentType: {
      type: String,
      enum: [
        "full-time",
        "part-time",
        "internship",
        "freelance",
        "contract",
        "self-employed",
      ],
      default: "full-time",
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      default: null,
    },

    current: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    technologies: {
      type: [String],
      default: [],
    },

    companyUrl: {
      type: String,
      default: null,
      trim: true,

      validate: {
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
      },
    },

    companyLogo: {
      url: {
        type: String,
        default: null,
        trim: true,
      },

      publicId: {
        type: String,
        default: null,
        trim: true,
      },
    },

    featured: {
      type: Boolean,
      default: false,
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
 * Validate employment dates.
 */
experienceSchema.pre("validate", function () {
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    this.invalidate("endDate", "End date cannot be before start date");
  }

  if (this.current) {
    this.endDate = null;
  }
});

/**
 * Indexes.
 */
experienceSchema.index({
  current: -1,
  startDate: -1,
  order: 1,
});

experienceSchema.index({
  company: 1,
});

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
