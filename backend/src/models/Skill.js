import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      minlength: [2, "Skill name must be at least 2 characters"],
      maxlength: [50, "Skill name cannot exceed 50 characters"],
    },

    category: {
      type: String,
      required: [true, "Skill category is required"],
      trim: true,
      lowercase: true,
      enum: {
        values: ["frontend", "backend", "database", "devops", "tools", "other"],
        message: "Invalid skill category",
      },
    },

    proficiency: {
      type: Number,
      required: [true, "Skill proficiency is required"],
      min: [0, "Proficiency cannot be below 0"],
      max: [100, "Proficiency cannot exceed 100"],
    },

    icon: {
      type: String,
      default: null,
      trim: true,
      maxlength: [100, "Icon cannot exceed 100 characters"],
    },

    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: [500, "Skill description cannot exceed 500 characters"],
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

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

skillSchema.index(
  {
    name: 1,
    category: 1,
  },
  {
    unique: true,
  }
);

skillSchema.index({
  category: 1,
  featured: -1,
  order: 1,
});

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
