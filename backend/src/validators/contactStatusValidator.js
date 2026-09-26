import { z } from "zod";

export const updateContactStatusSchema = z
  .object({
    status: z.enum(["new", "in-progress", "resolved", "archived"], {
      message: "Invalid contact status",
    }),
  })
  .strict();
