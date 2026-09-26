import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Certificate title is required"],
      trim: true,
      minlength: [2, "Certificate title must be at least 2 characters"],
      maxlength: [150, "Certificate title cannot exceed 150 characters"],
    },

    issuer: {
      type: String,
      required: [true, "Certificate issuer is required"],
      trim: true,
      minlength: [2, "Certificate issuer must be at least 2 characters"],
      maxlength: [150, "Certificate issuer cannot exceed 150 characters"],
    },

    issueDate: {
      type: Date,
      required: [true, "Certificate issue date is required"],
    },

    credentialId: {
      type: String,
      trim: true,
      default: null,
      maxlength: [150, "Credential ID cannot exceed 150 characters"],
    },

    credentialUrl: {
      type: String,
      trim: true,
      default: null,
      maxlength: [2048, "Credential URL cannot exceed 2048 characters"],
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

    image: {
      url: {
        type: String,
        trim: true,
        default: null,
        maxlength: [
          2048,
          "Certificate image URL cannot exceed 2048 characters",
        ],
      },

      publicId: {
        type: String,
        trim: true,
        default: null,
        maxlength: [
          500,
          "Certificate image public ID cannot exceed 500 characters",
        ],
      },

      width: {
        type: Number,
        default: null,
        min: [1, "Certificate image width must be greater than 0"],
        max: [10000, "Certificate image width cannot exceed 10000 pixels"],
      },

      height: {
        type: Number,
        default: null,
        min: [1, "Certificate image height must be greater than 0"],
        max: [10000, "Certificate image height cannot exceed 10000 pixels"],
      },

      format: {
        type: String,
        trim: true,
        default: null,
        maxlength: [20, "Certificate image format cannot exceed 20 characters"],
      },
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Certificate description cannot exceed 500 characters"],
      default: null,
    },

    order: {
      type: Number,
      default: 0,
      min: [0, "Order cannot be negative"],
      max: [1000000, "Order cannot exceed 1000000"],
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Used when retrieving certificates for the public portfolio.
certificateSchema.index({
  isVisible: 1,
  order: 1,
});

// Useful when filtering/grouping certificates by issuer.
certificateSchema.index({
  issuer: 1,
});

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
