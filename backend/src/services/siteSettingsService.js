import SiteSettings from "../models/SiteSettings.js";
import ApiError from "../utils/apiError.js";

/**
 * Get site settings.
 */
export const getSiteSettings = async () => {
  const settings = await SiteSettings.findOne();

  if (!settings) {
    throw new ApiError(404, "Site settings not found");
  }

  return settings;
};

/**
 * Create site settings.
 *
 * Only one settings document is allowed.
 */
export const createSiteSettings = async (settingsData) => {
  const existingSettings = await SiteSettings.findOne();

  if (existingSettings) {
    throw new ApiError(409, "Site settings already exist");
  }

  const settings = await SiteSettings.create(settingsData);

  return settings;
};

/**
 * Update site settings.
 */
export const updateSiteSettings = async (settingsData) => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create(settingsData);

    return settings;
  }

  Object.assign(settings, settingsData);

  await settings.save();

  return settings;
};

/**
 * Delete site settings.
 *
 * Normally this should rarely be used,
 * but it is provided for admin management.
 */
export const deleteSiteSettings = async () => {
  const settings = await SiteSettings.findOne();

  if (!settings) {
    throw new ApiError(404, "Site settings not found");
  }

  await settings.deleteOne();

  return {
    id: settings._id,
  };
};
