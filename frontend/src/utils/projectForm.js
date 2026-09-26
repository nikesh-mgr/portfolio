import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must not exceed 100 characters"),

  shortDescription: z
    .string()
    .trim()
    .min(1, "Short description is required")
    .max(250, "Short description must not exceed 250 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000, "Description must not exceed 5000 characters"),

  technologies: z
    .array(z.string().trim().min(1, "Technology cannot be empty"))
    .min(1, "Add at least one technology"),

  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category must not exceed 50 characters"),

  image: z.union([z.instanceof(File), z.string(), z.null()]).optional(),

  githubUrl: z
    .union([z.string().url("Enter a valid GitHub URL"), z.literal("")])
    .optional(),

  liveUrl: z
    .union([z.string().url("Enter a valid live URL"), z.literal("")])
    .optional(),

  featured: z.boolean(),
  published: z.boolean().default(false),

  status: z.enum(["completed", "in-progress", "planned"]),

  order: z
    .number()
    .int("Order must be a whole number")
    .min(0, "Order cannot be negative"),
});

export const toProjectFormData = (values) => {
  const payload = new FormData();
  for (const field of [
    "title",
    "shortDescription",
    "description",
    "category",
  ]) {
    payload.append(field, values[field].trim());
  }
  for (const technology of values.technologies) {
    if (technology.trim()) payload.append("technologies", technology.trim());
  }
  for (const field of ["githubUrl", "liveUrl"]) {
    payload.append(field, values[field]?.trim() || "");
  }
  payload.append("featured", String(Boolean(values.featured)));
  payload.append("published", String(Boolean(values.published)));
  payload.append("status", values.status);
  payload.append("order", String(values.order));
  if (values.image instanceof File) payload.append("image", values.image);
  return payload;
};
