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

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: [true, "Site name is required"],
      trim: true,
      minlength: [2, "Site name must be at least 2 characters"],
      maxlength: [100, "Site name cannot exceed 100 characters"],
    },

    developerName: {
      type: String,
      required: [true, "Developer name is required"],
      trim: true,
      minlength: [2, "Developer name must be at least 2 characters"],
      maxlength: [100, "Developer name cannot exceed 100 characters"],
    },

    tagline: {
      type: String,
      trim: true,
      maxlength: [200, "Tagline cannot exceed 200 characters"],
      default: null,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [3000, "Bio cannot exceed 3000 characters"],
      default: null,
    },

    profileImage: {
      type: String,
      trim: true,
      default: null,
      validate: urlValidator,
    },

    resumeUrl: {
      type: String,
      trim: true,
      default: null,
      validate: urlValidator,
    },

    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      default: null,
    },

    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
      default: null,
    },

    socialLinks: {
      github: {
        type: String,
        trim: true,
        default: null,
        validate: urlValidator,
      },

      linkedin: {
        type: String,
        trim: true,
        default: null,
        validate: urlValidator,
      },

      twitter: {
        type: String,
        trim: true,
        default: null,
        validate: urlValidator,
      },

      facebook: {
        type: String,
        trim: true,
        default: null,
        validate: urlValidator,
      },

      instagram: {
        type: String,
        trim: true,
        default: null,
        validate: urlValidator,
      },
    },

    seo: {
      metaTitle: {
        type: String,
        trim: true,
        maxlength: [70, "SEO meta title cannot exceed 70 characters"],
        default: null,
      },

      metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, "SEO meta description cannot exceed 160 characters"],
        default: null,
      },

      keywords: {
        type: [String],
        default: [],
      },

      ogImage: {
        type: String,
        trim: true,
        default: null,
        validate: urlValidator,
      },
    },

    isMaintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

export default SiteSettings;
