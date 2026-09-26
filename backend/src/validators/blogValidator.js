import { z } from "zod";
import { booleanInput, numberInput, stringList, optionalUrl } from "./input.js";
const nullableText = (max) => z.string().trim().max(max).nullable().optional();
export const createBlogSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(200)
    .optional(),
  excerpt: z.string().trim().min(1).max(300),
  content: z.string().trim().min(20).max(500000),
  category: nullableText(50),
  tags: stringList.optional(),
  published: booleanInput.optional(),
  readingTime: numberInput.refine((value) => value >= 1).optional(),
  order: numberInput.optional(),
  seo: z
    .object({
      metaTitle: nullableText(70),
      metaDescription: nullableText(160),
      keywords: stringList.optional(),
      canonicalUrl: optionalUrl,
    })
    .optional(),
});
export const updateBlogSchema = createBlogSchema.partial();
