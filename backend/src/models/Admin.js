import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    // Optional profile image stored in Cloudinary.
    // Only the URL and Cloudinary public ID are persisted.
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

    // Password hashes are never returned by default.
    // Authentication explicitly uses .select("+password").
    password: {
      type: String,
      required: [true, "Admin password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,

      // There is intentionally only one supported admin role.
      enum: ["admin"],

      default: "admin",

      // Prevent changing the role after the account is created.
      immutable: true,

      // IMPORTANT:
      // The portfolio is designed around a single admin account.
      // A unique index makes this guarantee database-enforced and
      // protects against concurrent /create-admin requests.
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
