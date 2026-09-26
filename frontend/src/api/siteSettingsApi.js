import api from "./axios";

/**
 * Get site settings.
 *
 * A 404 means the settings document has not been created yet.
 * Treat that as a valid empty state so the admin page can
 * display the create form instead of showing an error.
 */
export const getSiteSettings = async () => {
  try {
    const response = await api.get("/site-settings");

    return response.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return {
        success: true,
        settings: null,
      };
    }

    throw error;
  }
};

/**
 * Create site settings.
 *
 * Used only when no settings document exists.
 */
export const createSiteSettings = async (settingsData) => {
  const response = await api.post("/site-settings", settingsData);

  return response.data;
};

/**
 * Update site settings.
 *
 * Used when the settings document already exists.
 */
export const updateSiteSettings = async (settingsData) => {
  const response = await api.patch("/site-settings", settingsData);

  return response.data;
};

/**
 * Upload the first profile image.
 *
 * POST is used when no profile image currently exists.
 */
export const uploadProfileImage = async (file) => {
  const formData = new FormData();

  formData.append("profileImage", file);

  const response = await api.post("/site-settings/profile-image", formData);

  return response.data;
};

/**
 * Update an existing profile image.
 *
 * PATCH is used when a profile image already exists.
 */
export const updateProfileImage = async (file) => {
  const formData = new FormData();

  formData.append("profileImage", file);

  const response = await api.patch("/site-settings/profile-image", formData);

  return response.data;
};

/**
 * Delete the current profile image.
 */
export const deleteProfileImage = async () => {
  const response = await api.delete("/site-settings/profile-image");

  return response.data;
};

/**
 * Delete the entire site settings document.
 */
export const deleteSiteSettings = async () => {
  const response = await api.delete("/site-settings");

  return response.data;
};
