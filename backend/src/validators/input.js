import { z } from "zod";
import ApiError from "../utils/apiError.js";

export const booleanInput = z.preprocess(
  (value) => (value === "true" ? true : value === "false" ? false : value),
  z.boolean()
);
export const numberInput = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() ? Number(value) : value,
  z.number().int().min(0)
);
export const stringList = z.preprocess(
  (value) => (typeof value === "string" ? [value] : value),
  z.array(z.string().trim().min(1)).max(100)
);
export const httpUrl = z
  .string()
  .trim()
  .url()
  .refine(
    (value) => ["http:", "https:"].includes(new URL(value).protocol),
    "URL must use HTTP or HTTPS"
  );
export const optionalUrl = z
  .preprocess((value) => (value === "" ? null : value), httpUrl.nullable())
  .optional();
export function parseInput(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success)
    throw new ApiError(
      400,
      "Validation failed",
      result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
    );
  return result.data;
}

// Do not coerce null/false into the Unix epoch for required dates.
export const dateInput = z.preprocess(
  (value) =>
    typeof value === "string" || value instanceof Date ? value : undefined,
  z.coerce.date()
);
