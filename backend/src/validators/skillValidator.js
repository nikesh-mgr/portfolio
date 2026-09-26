import { z } from "zod";

const categorySchema = z.enum(
  ["frontend", "backend", "database", "devops", "tools", "other"],
  {
    message: "Invalid skill category",
  }
);

export const createSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Skill name must be at least 2 characters")
    .max(50, "Skill name cannot exceed 50 characters"),

  category: categorySchema,

  proficiency: z
    .number()
    .int("Proficiency must be an integer")
    .min(0, "Proficiency cannot be below 0")
    .max(100, "Proficiency cannot exceed 100"),

  icon: z
    .string()
    .trim()
    .max(100, "Icon cannot exceed 100 characters")
    .nullable()
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Skill description cannot exceed 500 characters")
    .nullable()
    .optional(),

  featured: z.boolean().default(false),

  order: z
    .number()
    .int("Order must be an integer")
    .min(0, "Order cannot be negative")
    .default(0),

  isActive: z.boolean().default(true),
});

export const updateSkillSchema = createSkillSchema.partial().extend({
  featured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});
