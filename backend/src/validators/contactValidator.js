import { z } from "zod";
export const createContactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .max(254, "Email cannot exceed 254 characters")
      .transform((value) => value.toLowerCase()),

    subject: z
      .string()
      .trim()
      .min(3, "Subject must be at least 3 characters")
      .max(200, "Subject cannot exceed 200 characters"),

    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .max(5000, "Message cannot exceed 5000 characters"),
  })
  .strict();
