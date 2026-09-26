import { dateInput } from "./input.js";
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

const dateSchema = dateInput;

export const normalizeCertificateData = (body) => {
  const data = { ...body };
  for (const key of ["credentialId", "credentialUrl", "description"]) {
    if (data[key] === "") data[key] = null;
  }
  if (data.isVisible === "true") data.isVisible = true;
  if (data.isVisible === "false") data.isVisible = false;
  if (typeof data.order === "string" && data.order.trim())
    data.order = Number(data.order);
  return data;
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
    .optional(),

  isVisible: z.boolean().optional(),
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
