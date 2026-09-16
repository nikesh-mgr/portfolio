import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "Resume",
      maxlength: [100, "Resume title cannot exceed 100 characters"],
    },

    file: {
      url: {
        type: String,
        required: [true, "Resume file URL is required"],
        trim: true,
      },

      publicId: {
        type: String,
        required: [true, "Resume public ID is required"],
        trim: true,
      },

      format: {
        type: String,
        default: "pdf",
      },

      size: {
        type: Number,
        default: null,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
