import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Shared URL Validation
|--------------------------------------------------------------------------
|
| Certificates may contain external credential URLs.
| Only HTTP and HTTPS URLs are accepted.
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

const nullableUrlSchema = z.union([urlSchema, z.null()]);

/*
|--------------------------------------------------------------------------
| Date Validation
|--------------------------------------------------------------------------
*/

const dateSchema = z.coerce.date({
  message: "Please provide a valid issue date",
});

/*
|--------------------------------------------------------------------------
| Normalization Helpers
|--------------------------------------------------------------------------
|
| Multipart/form-data sends values as strings.
| These helpers normalize valid values while deliberately preserving
| invalid values so Zod can reject them instead of silently changing
| them to a default.
|--------------------------------------------------------------------------
*/

const normalizeNullableString = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return value;
};

const normalizeBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  // Preserve invalid values so Zod returns a validation error.
  return value;
};

const normalizeNumber = (value, defaultValue = 0) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : value;
  }

  // Preserve invalid values so Zod can reject them.
  return value;
};

/*
|--------------------------------------------------------------------------
| Certificate Data Normalization
|--------------------------------------------------------------------------
|
| `partial` is important for PATCH requests.
|
| Create:
| - Missing order/isVisible receive their defaults.
|
| Update:
| - Missing fields remain missing and therefore are not overwritten.
|--------------------------------------------------------------------------
*/

export const normalizeCertificateData = (body, { partial = false } = {}) => {
  const normalizedData = {};

  if (body.title !== undefined) {
    normalizedData.title =
      typeof body.title === "string" ? body.title.trim() : body.title;
  }

  if (body.issuer !== undefined) {
    normalizedData.issuer =
      typeof body.issuer === "string" ? body.issuer.trim() : body.issuer;
  }

  if (body.issueDate !== undefined) {
    normalizedData.issueDate = body.issueDate;
  }

  if (body.credentialId !== undefined) {
    normalizedData.credentialId = normalizeNullableString(body.credentialId);
  }

  if (body.credentialUrl !== undefined) {
    normalizedData.credentialUrl = normalizeNullableString(body.credentialUrl);
  }

  if (body.description !== undefined) {
    normalizedData.description = normalizeNullableString(body.description);
  }

  if (!partial || body.order !== undefined) {
    normalizedData.order = normalizeNumber(body.order);
  }

  if (!partial || body.isVisible !== undefined) {
    normalizedData.isVisible = normalizeBoolean(body.isVisible, true);
  }

  return normalizedData;
};

/*
|--------------------------------------------------------------------------
| Create Certificate Validation
|--------------------------------------------------------------------------
*/

export const createCertificateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Certificate title must be at least 2 characters")
      .max(150, "Certificate title cannot exceed 150 characters"),

    issuer: z
      .string()
      .trim()
      .min(2, "Certificate issuer must be at least 2 characters")
      .max(150, "Certificate issuer cannot exceed 150 characters"),

    issueDate: dateSchema,

    credentialId: z
      .string()
      .trim()
      .max(150, "Credential ID cannot exceed 150 characters")
      .nullable()
      .optional(),

    credentialUrl: nullableUrlSchema.optional(),

    description: z
      .string()
      .trim()
      .max(500, "Certificate description cannot exceed 500 characters")
      .nullable()
      .optional(),

    order: z
      .number()
      .int("Order must be an integer")
      .min(0, "Order cannot be negative")
      .max(1000000, "Order cannot exceed 1000000")
      .default(0),

    isVisible: z.boolean().default(true),
  })
  .strict();

/*
|--------------------------------------------------------------------------
| Update Certificate Validation
|--------------------------------------------------------------------------
|
| PATCH requests are partial. Fields that are not supplied must remain
| unchanged in the database.
|--------------------------------------------------------------------------
*/

export const updateCertificateSchema = createCertificateSchema
  .partial()
  .strict();
