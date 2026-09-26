import { z } from "zod";

/*
|--------------------------------------------------------------------------
| HTTP/HTTPS URL validation
|--------------------------------------------------------------------------
|
| Project links must use HTTP or HTTPS.
| Protocols such as javascript:, data:, and file: are rejected.
|
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
      message: "URL must use HTTP or HTTPS",
    }
  );

/*
|--------------------------------------------------------------------------
| Optional URL normalization
|--------------------------------------------------------------------------
|
| Multipart/form-data may send an empty string for optional fields.
| Convert empty values to null so the service/model receives a
| predictable value.
|
*/

const optionalUrlSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return value;
}, urlSchema.nullable());

/*
|--------------------------------------------------------------------------
| Boolean normalization
|--------------------------------------------------------------------------
|
| FormData sends boolean values as strings.
|
| "true"  -> true
| "false" -> false
|
*/

const booleanSchema = z.preprocess((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return value;
}, z.boolean());

/*
|--------------------------------------------------------------------------
| Order normalization
|--------------------------------------------------------------------------
|
| FormData sends numeric values as strings.
|
| "0"  -> 0
| "10" -> 10
|
*/

const orderSchema = z.preprocess(
  (value) => {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
      const number = Number(value);

      return Number.isFinite(number) ? number : value;
    }

    return value;
  },
  z
    .number({
      error: "Order must be a number",
    })
    .finite("Order must be a finite number")
    .int("Order must be an integer")
    .min(0, "Order cannot be negative")
);

/*
|--------------------------------------------------------------------------
| Technologies normalization
|--------------------------------------------------------------------------
|
| Multipart/form-data can produce either:
|
| technologies=React
|
| or:
|
| technologies=React
| technologies=Node.js
| technologies=MongoDB
|
| Normalize both forms to an array before validation.
|
*/

const technologiesSchema = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      return [value];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return value;
  },
  z
    .array(
      z
        .string()
        .trim()
        .min(1, "Technology cannot be empty")
        .max(50, "Technology cannot exceed 50 characters")
    )
    .min(1, "At least one technology is required")
    .max(30, "A project cannot contain more than 30 technologies")
);

/*
|--------------------------------------------------------------------------
| Gallery image URL validation
|--------------------------------------------------------------------------
|
| Gallery images are normally uploaded through the dedicated
| gallery endpoint.
|
*/

const imagesSchema = z
  .array(urlSchema)
  .max(10, "A project cannot contain more than 10 additional images");

/*
|--------------------------------------------------------------------------
| Shared project fields
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Projects are always published.
|
| There is intentionally NO `published` field.
|
| The primary image file is handled separately by
| Multer/Cloudinary.
|
*/

const projectFields = {
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

  technologies: technologiesSchema,

  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category cannot exceed 50 characters"),

  /*
   * Internal/non-multipart image URL support.
   *
   * Normal frontend create/update requests use Multer.
   */

  image: z
    .string()
    .trim()
    .max(2048, "Image URL cannot exceed 2048 characters")
    .url("Please provide a valid image URL")
    .nullable()
    .optional(),

  images: imagesSchema.optional(),

  githubUrl: optionalUrlSchema.optional(),

  liveUrl: optionalUrlSchema.optional(),

  /*
   * Featured is independent from publication.
   *
   * A project can be:
   * - featured
   * - not featured
   *
   * But it is always published.
   */

  featured: booleanSchema.optional(),

  status: z
    .enum(["completed", "in-progress", "planned"], {
      message: "Status must be completed, in-progress, or planned",
    })
    .optional(),

  order: orderSchema.optional(),
};

/*
|--------------------------------------------------------------------------
| Create project validation
|--------------------------------------------------------------------------
|
| Strict validation prevents unexpected fields from reaching
| the controller/service layer.
|
*/

export const createProjectSchema = z.object(projectFields).strict();

/*
|--------------------------------------------------------------------------
| Update project validation
|--------------------------------------------------------------------------
|
| Every field is optional for PATCH requests, but supplied fields
| must still satisfy the original validation rules.
|
*/

export const updateProjectSchema = createProjectSchema.partial();

/*
|--------------------------------------------------------------------------
| Remove project gallery image validation
|--------------------------------------------------------------------------
|
| Gallery deletion is performed using the Cloudinary publicId,
| not the image URL.
|
*/

export const removeProjectImageSchema = z
  .object({
    publicId: z
      .string()
      .trim()
      .min(1, "Cloudinary public ID is required")
      .max(500, "Cloudinary public ID cannot exceed 500 characters"),
  })
  .strict();
