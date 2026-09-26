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

const nullableUrlSchema = urlSchema.nullable().optional();

const dateSchema = dateInput;

const nullableDateSchema = dateInput.nullable().optional();

const stringArraySchema = z
  .array(z.string().trim().min(1, "Array items cannot be empty"))
  .optional();

const experienceBaseSchema = z.object({
  company: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(150, "Company name cannot exceed 150 characters"),

  position: z
    .string()
    .trim()
    .min(2, "Position must be at least 2 characters")
    .max(150, "Position cannot exceed 150 characters"),

  location: z
    .string()
    .trim()
    .max(150, "Location cannot exceed 150 characters")
    .nullable()
    .optional(),

  employmentType: z.enum(
    [
      "full-time",
      "part-time",
      "internship",
      "freelance",
      "contract",
      "self-employed",
    ],
    {
      message: "Invalid employment type",
    }
  ),

  startDate: dateSchema,

  endDate: nullableDateSchema,

  current: z.boolean().optional(),

  description: z
    .string()
    .trim()
    .max(3000, "Description cannot exceed 3000 characters")
    .nullable()
    .optional(),

  responsibilities: stringArraySchema,

  technologies: stringArraySchema,

  companyUrl: nullableUrlSchema,

  featured: z.boolean().optional(),

  order: z
    .number()
    .int("Order must be an integer")
    .min(0, "Order cannot be negative")
    .optional(),
});

export const createExperienceSchema = experienceBaseSchema.superRefine(
  (data, ctx) => {
    if (data.current && data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be empty for current experience",
      });
    }

    if (
      !data.current &&
      data.endDate &&
      data.startDate &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date cannot be before start date",
      });
    }
  }
);

export const updateExperienceSchema = experienceBaseSchema
  .partial()
  .superRefine((data, ctx) => {
    if (data.current === true && data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be empty for current experience",
      });
    }

    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date cannot be before start date",
      });
    }
  });
