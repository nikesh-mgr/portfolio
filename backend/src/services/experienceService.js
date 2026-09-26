import mongoose from "mongoose";
import Experience from "../models/Experience.js";
import ApiError from "../utils/ApiError.js";

/**
 * Create a new experience.
 */
export const createExperience = async (experienceData) => {
  const { company, position, startDate } = experienceData;

  const existingExperience = await Experience.findOne({
    company,
    position,
    startDate,
  });

  if (existingExperience) {
    throw new ApiError(409, "This work experience already exists");
  }

  const experience = await Experience.create(experienceData);

  return experience;
};

/**
 * Get all experiences.
 */
export const getAllExperiences = async () => {
  const experiences = await Experience.find().sort({
    current: -1,
    startDate: -1,
    order: 1,
  });

  return experiences;
};

/**
 * Get experience by ID.
 */
export const getExperienceById = async (experienceId) => {
  if (!mongoose.Types.ObjectId.isValid(experienceId)) {
    throw new ApiError(400, "Invalid experience ID");
  }

  const experience = await Experience.findById(experienceId);

  if (!experience) {
    throw new ApiError(404, "Experience not found");
  }

  return experience;
};

/**
 * Update an experience.
 */
export const updateExperience = async (experienceId, experienceData) => {
  if (!mongoose.Types.ObjectId.isValid(experienceId)) {
    throw new ApiError(400, "Invalid experience ID");
  }

  const experience = await Experience.findById(experienceId);

  if (!experience) {
    throw new ApiError(404, "Experience not found");
  }

  const company = experienceData.company ?? experience.company;

  const position = experienceData.position ?? experience.position;

  const startDate = experienceData.startDate ?? experience.startDate;

  const existingExperience = await Experience.findOne({
    company,
    position,
    startDate,
    _id: {
      $ne: experienceId,
    },
  });

  if (existingExperience) {
    throw new ApiError(409, "This work experience already exists");
  }

  Object.assign(experience, experienceData);

  await experience.save();

  return experience;
};

/**
 * Delete an experience.
 */
export const deleteExperience = async (experienceId) => {
  if (!mongoose.Types.ObjectId.isValid(experienceId)) {
    throw new ApiError(400, "Invalid experience ID");
  }

  const experience = await Experience.findById(experienceId);

  if (!experience) {
    throw new ApiError(404, "Experience not found");
  }

  const companyLogo = experience.companyLogo?.publicId
    ? {
        publicId: experience.companyLogo.publicId,
      }
    : null;

  await experience.deleteOne();

  return {
    id: experience._id,
    companyLogo,
  };
};
