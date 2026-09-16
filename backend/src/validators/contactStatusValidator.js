import { z } from "zod";

export const updateContactStatusSchema = z
  .object({
    status: z.enum(["new", "read", "replied", "archived"], {
      message: "Invalid contact status",
    }),
  })
  .strict();
