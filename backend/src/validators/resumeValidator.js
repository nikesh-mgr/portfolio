import { z } from "zod";
import { booleanInput } from "./input.js";
export const resumeMetadataSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  isActive: booleanInput.optional(),
});
