import {
  getSiteSettings,
  createSiteSettings,
  updateSiteSettings,
  createProfileImage,
  updateProfileImage,
  deleteProfileImage,
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
  const settings = await createSiteSettings(req.body);

  res.status(201).json({
    success: true,
    message: "Site settings created successfully",
    settings,
  });
};

/**
 * Update normal site settings.
 */
export const updateSettings = async (req, res) => {
  const settings = await updateSiteSettings(req.body);

  res.status(200).json({
    success: true,
    message: "Site settings updated successfully",
    settings,
  });
};

/**
 * Upload profile image.
 *
 * POST /api/site-settings/profile-image
 */
export const createProfileImageController = async (req, res) => {
  const settings = await createProfileImage(req.file);
  console.log("PROFILE IMAGE FILE:", req.file);

  res.status(201).json({
    success: true,
    message: "Profile image uploaded successfully",
    settings,
  });
};

/**
 * Update profile image.
 *
 * PATCH /api/site-settings/profile-image
 */
export const updateProfileImageController = async (req, res) => {
  const settings = await updateProfileImage(req.file);

  res.status(200).json({
    success: true,
    message: "Profile image updated successfully",
    settings,
  });
};

/**
 * Delete profile image.
 *
 * DELETE /api/site-settings/profile-image
 */
export const deleteProfileImageController = async (req, res) => {
  const settings = await deleteProfileImage();

  res.status(200).json({
    success: true,
    message: "Profile image deleted successfully",
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
