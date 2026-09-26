import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    image: {
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

    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
      minlength: [2, "Admin name must be at least 2 characters"],
      maxlength: [100, "Admin name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Admin email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Admin password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      immutable: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
    resume: {
      url: { type: String, default: null, trim: true },
      publicId: { type: String, default: null, trim: true },
      originalName: { type: String, default: null, trim: true },
      uploadedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.index({ role: 1 }, { unique: true });

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
