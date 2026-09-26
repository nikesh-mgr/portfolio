import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "Resume",
      minlength: [1, "Resume title cannot be empty"],
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
        enum: ["pdf"],
        default: "pdf",
      },

      size: {
        type: Number,
        min: [1, "Resume file size must be greater than 0"],
        default: null,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
