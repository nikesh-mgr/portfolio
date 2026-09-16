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
      },

      publicId: {
        type: String,
        trim: true,
        default: null,
      },

      width: {
        type: Number,
        default: null,
      },

      height: {
        type: Number,
        default: null,
      },

      format: {
        type: String,
        trim: true,
        default: null,
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

certificateSchema.index({
  isVisible: 1,
  order: 1,
});

certificateSchema.index({
  issuer: 1,
});

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
