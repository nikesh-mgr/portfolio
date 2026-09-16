import { z } from "zod";

const urlSchema = z
  .string()
  .trim()
  .url("Please provide a valid URL")
  .refine(
    (value) => value.startsWith("http://") || value.startsWith("https://"),
    {
      message: "URL must use HTTP or HTTPS",
    }
  );

const nullableUrlSchema = z.union([urlSchema, z.null()]);

const dateSchema = z.coerce.date({
  message: "Please provide a valid issue date",
});

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

  return value === "true";
};

const normalizeNumber = (value, defaultValue = 0) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : defaultValue;
};

export const normalizeCertificateData = (body) => {
  return {
    title: body.title?.trim(),
    issuer: body.issuer?.trim(),
    issueDate: body.issueDate,

    credentialId: normalizeNullableString(body.credentialId),

    credentialUrl: normalizeNullableString(body.credentialUrl),

    description: normalizeNullableString(body.description),

    order: normalizeNumber(body.order),

    isVisible: normalizeBoolean(body.isVisible, true),
  };
};

export const createCertificateSchema = z.object({
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
    .default(0),

  isVisible: z.boolean().default(true),
});

export const updateCertificateSchema = createCertificateSchema
  .partial()
  .extend({
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
  });
