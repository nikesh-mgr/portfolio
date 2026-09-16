import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String, 
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: [3, "Subject must be at least 3 characters"],
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },

    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "archived"],
      default: "new",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    repliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for admin message management.
 */
contactSchema.index({
  status: 1,
  createdAt: -1,
});

contactSchema.index({
  isRead: 1,
  createdAt: -1,
});

contactSchema.index({
  email: 1,
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
