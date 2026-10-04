import { z } from "zod";

/*
|--------------------------------------------------------------------------
| HTTP / HTTPS URL validation
|--------------------------------------------------------------------------
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
| Optional URL
|--------------------------------------------------------------------------
|
| FormData may omit optional URLs completely.
|
| Empty string is converted to null.
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
| FormData:
|
| "true"  -> true
| "false" -> false
|
*/

const booleanSchema = z.preprocess(
  (value) => {
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
  },
  z.boolean({
    error: "Featured must be true or false",
  })
);

/*
|--------------------------------------------------------------------------
| Number normalization
|--------------------------------------------------------------------------
|
| FormData sends numbers as strings.
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
| Technologies
|--------------------------------------------------------------------------
|
| Multer produces:
|
| technologies=React
|
| OR:
|
| technologies=React
| technologies=Node.js
| technologies=MongoDB
|
| Normalize both into an array.
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
*/

const imagesSchema = z
  .array(urlSchema)
  .max(10, "A project cannot contain more than 10 additional images");

/*
|--------------------------------------------------------------------------
| Project fields
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| There is NO:
| - published
|
| Project visibility is represented by:
| - featured
|
| All projects are publicly available.
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
   * Image URL is only used if a URL is explicitly supplied.
   *
   * Normal create/update requests upload the image using Multer.
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

  featured: booleanSchema.optional(),

  status: z
    .enum(["completed", "in-progress", "planned"], {
      error: "Status must be completed, in-progress, or planned",
    })
    .optional(),

  order: orderSchema.optional(),
};

/*
|--------------------------------------------------------------------------
| Create project
|--------------------------------------------------------------------------
*/

export const createProjectSchema = z.object(projectFields).strict();

/*
|--------------------------------------------------------------------------
| Update project
|--------------------------------------------------------------------------
*/

export const updateProjectSchema = createProjectSchema.partial();

/*
|--------------------------------------------------------------------------
| Remove project gallery image
|--------------------------------------------------------------------------
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
