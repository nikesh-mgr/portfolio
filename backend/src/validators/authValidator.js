import { z } from "zod";

/**
 * Login validation.
 *
 * Only email and password are accepted.
 * Zod strips unknown object keys by default, which prevents
 * unexpected fields from reaching the authentication service.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254, "Email cannot exceed 254 characters")
    .email("Please provide a valid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters"),
});

/**
 * Initial admin account validation.
 *
 * The role is intentionally NOT accepted from the client.
 * The backend always creates the account with role: "admin".
 */
export const createAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Admin name must be at least 2 characters")
    .max(100, "Admin name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .max(254, "Email cannot exceed 254 characters")
    .email("Please provide a valid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters"),
});
