import { parseInput } from "../validators/input.js";
import {
  settingsSchema,
  updateSettingsSchema,
} from "../validators/siteSettingsValidator.js";
import {
  getSiteSettings,
  createSiteSettings,
  updateSiteSettings,
  deleteSiteSettings,
} from "../services/siteSettingsService.js";

/**
 * Get site settings.
 */
export const getSettings = async (req, res) => {
  const settings = await getSiteSettings();

  res.status(200).json({
    success: true,
    settings,
  });
};

/**
 * Create site settings.
 */
export const createSettings = async (req, res) => {
  const settings = await createSiteSettings(
    parseInput(settingsSchema, req.body)
  );

  res.status(201).json({
    success: true,
    message: "Site settings created successfully",
    settings,
  });
};

/**
 * Update site settings.
 */
export const updateSettings = async (req, res) => {
  const settings = await updateSiteSettings(
    parseInput(updateSettingsSchema, req.body)
  );

  res.status(200).json({
    success: true,
    message: "Site settings updated successfully",
    settings,
  });
};

/**
 * Delete site settings.
 */
export const deleteSettings = async (req, res) => {
  await deleteSiteSettings();

  res.status(200).json({
    success: true,
    message: "Site settings deleted successfully",
  });
};
