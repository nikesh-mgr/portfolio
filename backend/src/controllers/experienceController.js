import {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
} from "../services/experienceService.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import parseExperienceFormData from "../utils/parseExperienceFormData.js";
/**
 * Create experience.
 */
export const createExperienceController = async (req, res) => {
  let uploadedLogo = null;

  try {
    const experienceData = parseExperienceFormData(req.body);

    if (req.file) {
      uploadedLogo = await uploadToCloudinary(
        req.file.buffer,
        "portfolio/experience"
      );

      experienceData.companyLogo = {
        url: uploadedLogo.secure_url,
        publicId: uploadedLogo.public_id,
      };
    }

    const experience = await createExperience(experienceData);

    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      experience,
    });
  } catch (error) {
    if (uploadedLogo?.public_id) {
      try {
        await deleteFromCloudinary(uploadedLogo.public_id);
      } catch {
        // Ignore cleanup error.
      }
    }

    throw error;
  }
};
/**
 * Get all experiences.
 */
export const getExperiences = async (req, res) => {
  const experiences = await getAllExperiences();

  res.status(200).json({
    success: true,
    count: experiences.length,
    experiences,
  });
};

/**
 * Get experience by ID.
 */
export const getExperience = async (req, res) => {
  const experience = await getExperienceById(req.params.id);

  res.status(200).json({
    success: true,
    experience,
  });
};

/**
 * Update experience.
 */
export const updateExperienceController = async (req, res) => {
  let uploadedLogo = null;

  try {
    const existingExperience = await getExperienceById(req.params.id);

    const updateData = parseExperienceFormData(req.body);

    if (req.file) {
      uploadedLogo = await uploadToCloudinary(
        req.file.buffer,
        "portfolio/experience"
      );

      updateData.companyLogo = {
        url: uploadedLogo.secure_url,
        publicId: uploadedLogo.public_id,
      };
    }

    const experience = await updateExperience(req.params.id, updateData);

    if (req.file && existingExperience.companyLogo?.publicId) {
      try {
        await deleteFromCloudinary(existingExperience.companyLogo.publicId);
      } catch {
        // Ignore cleanup error.
      }
    }

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    if (uploadedLogo?.public_id) {
      try {
        await deleteFromCloudinary(uploadedLogo.public_id);
      } catch {
        // Ignore cleanup error.
      }
    }

    throw error;
  }
};
/**
 * Delete experience.
 */
export const deleteExperienceController = async (req, res) => {
  const result = await deleteExperience(req.params.id);

  /**
   * Remove company logo from Cloudinary.
   */
  if (result.companyLogo?.publicId) {
    try {
      await deleteFromCloudinary(result.companyLogo.publicId);
    } catch {
      // Ignore cleanup error.
    }
  }

  res.status(200).json({
    success: true,
    message: "Experience deleted successfully",
  });
};
