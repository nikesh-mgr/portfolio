import { z } from "zod";
import { booleanInput, numberInput, stringList, optionalUrl } from "./input.js";

export const createProjectSchema = z.object({
  title: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(200)
    .optional(),
  shortDescription: z.string().trim().min(1).max(250),
  description: z.string().trim().min(1).max(5000),
  technologies: stringList.refine(
    (value) => value.length > 0,
    "At least one technology is required"
  ),
  category: z.string().trim().min(1).max(50),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  featured: booleanInput.optional(),
  published: booleanInput.optional(),
  status: z.enum(["completed", "in-progress", "planned"]).optional(),
  order: numberInput.optional(),
});
export const updateProjectSchema = createProjectSchema.partial();
