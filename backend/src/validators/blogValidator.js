import { z } from "zod";

/**
 * Reusable HTTP/HTTPS URL validator.
 *
 * Only web URLs are accepted. This prevents dangerous schemes such as
 * javascript:, data:, and file: from being accepted as normal URLs.
 */
const urlSchema = z
  .string()
  .trim()
  .max(2048, "URL cannot exceed 2048 characters")
  .url("Please provide a valid URL")
  .refine(
    (value) => {
      try {
        const url = new URL(value);

        return ["http:", "https:"].includes(url.protocol);
      } catch {
        return false;
      }
    },
    {
      message: "Only HTTP and HTTPS URLs are allowed",
    }
  );

/**
 * Optional URL.
 *
 * FormData often sends empty strings for optional fields, so empty
 * values are converted to null before validation.
 */
const optionalUrlSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return value;
}, urlSchema.nullable());

/**
 * Boolean schema for JSON and multipart/form-data.
 *
 * FormData sends values such as:
 *   "true"
 *   "false"
 *
 * Anything else is rejected instead of being silently converted.
 */
const booleanSchema = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;

  return value;
}, z.boolean());

/**
 * Positive integer schema used for reading time and ordering.
 *
 * Numeric strings are accepted because they commonly come from
 * multipart/form-data requests.
 */
const nonNegativeIntegerSchema = z.preprocess(
  (value) => {
    if (typeof value === "string" && value.trim() !== "") {
      const number = Number(value);

      if (Number.isFinite(number)) {
        return number;
      }
    }

    return value;
  },
  z
    .number({
      error: "Value must be a number",
    })
    .finite("Value must be a finite number")
    .int("Value must be an integer")
    .min(0, "Value cannot be negative")
);

/**
 * Reading time must be a positive integer.
 */
const readingTimeSchema = z.preprocess(
  (value) => {
    if (typeof value === "string" && value.trim() !== "") {
      const number = Number(value);

      if (Number.isFinite(number)) {
        return number;
      }
    }

    return value;
  },
  z
    .number({
      error: "Reading time must be a number",
    })
    .finite("Reading time must be a finite number")
    .int("Reading time must be an integer")
    .min(1, "Reading time must be at least 1 minute")
    .max(120, "Reading time cannot exceed 120 minutes")
);

/**
 * Normalize a tag/keyword array.
 *
 * Supports:
 *   ["react", "node"]
 *
 * and FormData-style:
 *   "react,node"
 *
 * The frontend should preferably send repeated fields/arrays,
 * but accepting a comma-separated string keeps the API practical.
 */
const stringArraySchema = (fieldName, maxItems, maxLength = 50) =>
  z.preprocess(
    (value) => {
      if (value === undefined || value === null || value === "") {
        return [];
      }

      if (typeof value === "string") {
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      if (Array.isArray(value)) {
        return value.map((item) =>
          typeof item === "string" ? item.trim() : item
        );
      }

      return value;
    },
    z
      .array(
        z
          .string()
          .trim()
          .min(1, `${fieldName} cannot contain empty values`)
          .max(
            maxLength,
            `Each ${fieldName.slice(0, -1)} cannot exceed ${maxLength} characters`
          )
      )
      .max(maxItems, `${fieldName} cannot contain more than ${maxItems} items`)
  );

/**
 * SEO validation.
 */
const seoSchema = z
  .object({
    metaTitle: z
      .string()
      .trim()
      .max(70, "SEO meta title cannot exceed 70 characters")
      .nullable()
      .optional(),

    metaDescription: z
      .string()
      .trim()
      .max(160, "SEO meta description cannot exceed 160 characters")
      .nullable()
      .optional(),

    keywords: stringArraySchema("keywords", 30),

    canonicalUrl: optionalUrlSchema,
  })
  .strict();

/**
 * Base blog fields.
 *
 * coverImage is intentionally NOT included.
 * Cover images use:
 *
 * POST /api/blogs/:id/cover-image
 */
const blogFields = {
  title: z
    .string()
    .trim()
    .min(3, "Blog title must be at least 3 characters")
    .max(200, "Blog title cannot exceed 200 characters"),

  excerpt: z
    .string()
    .trim()
    .min(10, "Blog excerpt must be at least 10 characters")
    .max(300, "Blog excerpt cannot exceed 300 characters"),

  content: z
    .string()
    .trim()
    .min(20, "Blog content must be at least 20 characters")
    .max(100000, "Blog content cannot exceed 100000 characters"),

  tags: stringArraySchema("tags", 20),

  category: z
    .string()
    .trim()
    .min(2, "Blog category must be at least 2 characters")
    .max(50, "Blog category cannot exceed 50 characters")
    .nullable()
    .optional(),

  published: booleanSchema,

  readingTime: readingTimeSchema,

  seo: seoSchema.optional(),

  order: nonNegativeIntegerSchema,
};

/**
 * Create blog validation.
 *
 * Slug is intentionally not accepted as a trusted client field.
 * The backend generates it from the title.
 */
export const createBlogSchema = z.object(blogFields).strict();

/**
 * Update blog validation.
 *
 * Every normal blog field is optional during PATCH.
 *
 * Slug and coverImage are deliberately excluded:
 * - slug is generated from title
 * - coverImage has its own endpoint
 */
export const updateBlogSchema = z
  .object({
    title: blogFields.title.optional(),

    excerpt: blogFields.excerpt.optional(),

    content: blogFields.content.optional(),

    tags: blogFields.tags.optional(),

    category: blogFields.category,

    published: blogFields.published.optional(),

    readingTime: blogFields.readingTime.optional(),

    seo: blogFields.seo.optional(),

    order: blogFields.order.optional(),
  })
  .strict();

/**
 * Blog ID parameter validation.
 *
 * Used by routes that operate on /:id.
 */
export const blogIdSchema = z
  .object({
    id: z
      .string()
      .trim()
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid blog ID"),
  })
  .strict();

/**
 * Admin blog ID parameter validation.
 *
 * The admin detail route uses :blogid.
 */
export const blogAdminIdSchema = z
  .object({
    blogid: z
      .string()
      .trim()
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid blog ID"),
  })
  .strict();

/**
 * Blog slug parameter validation.
 */
export const blogSlugSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1, "Blog slug is required")
      .max(220, "Blog slug cannot exceed 220 characters")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid blog slug"),
  })
  .strict();
