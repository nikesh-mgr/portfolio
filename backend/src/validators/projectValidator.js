import { z } from "zod";

const urlSchema = z
  .string()
  .url("Please provide a valid URL")
  .refine(
    (value) => value.startsWith("http://") || value.startsWith("https://"),
    {
      message: "URL must use HTTP or HTTPS",
    }
  );

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Project title must be at least 2 characters")
    .max(100, "Project title cannot exceed 100 characters"),

  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters")
    .max(250, "Short description cannot exceed 250 characters"),

  description: z
    .string()
    .trim()
    .min(20, "Project description must be at least 20 characters")
    .max(5000, "Project description cannot exceed 5000 characters"),

  technologies: z
    .array(z.string().trim().min(1))
    .min(1, "At least one technology is required"),

  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category cannot exceed 50 characters"),

  image: urlSchema.nullable().optional(),

  images: z.array(urlSchema).optional(),

  githubUrl: urlSchema.nullable().optional(),

  liveUrl: urlSchema.nullable().optional(),

  featured: z.boolean().optional(),

  status: z
    .enum(["completed", "in-progress", "planned"], {
      message: "Status must be completed, in-progress, or planned",
    })
    .optional(),

  order: z
    .number()
    .min(0, "Order cannot be negative")
    .int("Order must be an integer")
    .optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
