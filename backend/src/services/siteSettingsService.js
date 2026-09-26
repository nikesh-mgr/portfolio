import SiteSettings from "../models/SiteSettings.js";
import ApiError from "../utils/ApiError.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";

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
 * Update normal site settings.
 *
 * Profile image is handled by dedicated endpoints.
 */
export const updateSiteSettings = async (settingsData) => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create(settingsData);

    return settings;
  }

  // Prevent profile image from being modified
  // through the normal settings endpoint.
  const { profileImage, ...allowedSettings } = settingsData;

  Object.assign(settings, allowedSettings);

  await settings.save();

  return settings;
};

/**
 * Upload profile image.
 *
 * POST:
 * Used when no profile image currently exists.
 */
export const createProfileImage = async (file) => {
  if (!file?.buffer) {
    throw new ApiError(400, "Profile image is required");
  }

  const settings = await SiteSettings.findOne();

  if (!settings) {
    throw new ApiError(404, "Site settings not found");
  }

  if (settings.profileImage) {
    throw new ApiError(
      409,
      "Profile image already exists. Use the update profile image endpoint."
    );
  }

  const uploadedImage = await uploadToCloudinary(
    file.buffer,
    "portfolio/site/profile",
    "image"
  );

  settings.profileImage = {
    url: uploadedImage.secure_url,
    publicId: uploadedImage.public_id,
  };

  await settings.save();

  return settings;
};

/**
 * Update profile image.
 *
 * PATCH:
 * Used when a profile image already exists.
 */
export const updateProfileImage = async (file) => {
  if (!file?.buffer) {
    throw new ApiError(400, "Profile image is required");
  }

  const settings = await SiteSettings.findOne();

  if (!settings) {
    throw new ApiError(404, "Site settings not found");
  }

  if (!settings.profileImage) {
    throw new ApiError(
      404,
      "Profile image does not exist. Use the upload profile image endpoint."
    );
  }

  const oldProfileImage = settings.profileImage;

  const uploadedImage = await uploadToCloudinary(
    file.buffer,
    "portfolio/site/profile",
    "image"
  );

  settings.profileImage = {
    url: uploadedImage.secure_url,
    publicId: uploadedImage.public_id,
  };

  await settings.save();

  // Delete old image after database update.
  if (oldProfileImage.publicId) {
    try {
      await deleteFromCloudinary(oldProfileImage.publicId, "image");
    } catch (error) {
      console.error(
        "Failed to delete old profile image from Cloudinary:",
        error
      );
    }
  }

  return settings;
};

/**
 * Delete profile image.
 */
export const deleteProfileImage = async () => {
  const settings = await SiteSettings.findOne();

  if (!settings) {
    throw new ApiError(404, "Site settings not found");
  }

  if (!settings.profileImage) {
    throw new ApiError(404, "Profile image not found");
  }

  const profileImage = settings.profileImage;

  settings.profileImage = null;

  await settings.save();

  if (profileImage.publicId) {
    try {
      await deleteFromCloudinary(profileImage.publicId, "image");
    } catch (error) {
      console.error("Failed to delete profile image from Cloudinary:", error);
    }
  }

  return settings;
};

/**
 * Delete site settings.
 */
export const deleteSiteSettings = async () => {
  const settings = await SiteSettings.findOne();

  if (!settings) {
    throw new ApiError(404, "Site settings not found");
  }

  if (settings.profileImage?.publicId) {
    try {
      await deleteFromCloudinary(settings.profileImage.publicId, "image");
    } catch (error) {
      console.error("Failed to delete profile image from Cloudinary:", error);
    }
  }

  await settings.deleteOne();

  return {
    id: settings._id,
  };
};
