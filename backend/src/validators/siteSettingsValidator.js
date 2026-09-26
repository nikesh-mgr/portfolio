import { z } from "zod";
import { optionalUrl, booleanInput, stringList } from "./input.js";
const text = (max) => z.string().trim().max(max).nullable().optional();
export const settingsSchema = z.object({
  siteName: z.string().trim().min(2).max(100),
  developerName: z.string().trim().min(2).max(100),
  tagline: text(200),
  bio: text(3000),
  location: text(100),
  profileImage: optionalUrl,
  resumeUrl: optionalUrl,
  contactEmail: z.string().trim().email().max(254).nullable().optional(),
  socialLinks: z
    .object({
      github: optionalUrl,
      linkedin: optionalUrl,
      twitter: optionalUrl,
      facebook: optionalUrl,
      instagram: optionalUrl,
    })
    .optional(),
  seo: z
    .object({
      metaTitle: text(70),
      metaDescription: text(160),
      keywords: stringList.optional(),
      ogImage: optionalUrl,
    })
    .optional(),
  isMaintenanceMode: booleanInput.optional(),
});
export const updateSettingsSchema = settingsSchema.partial();
