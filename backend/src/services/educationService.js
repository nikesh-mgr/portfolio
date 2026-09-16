import mongoose from "mongoose";
import Education from "../models/Education.js";
import ApiError from "../utils/apiError.js";

/**
 * Create a new education record.
 */
export const createEducation = async (educationData) => {
  const { institution, degree, startDate } = educationData;

  const existingEducation = await Education.findOne({
    institution,
    degree,
    startDate,
  });

  if (existingEducation) {
    throw new ApiError(409, "This education record already exists");
  }

  const education = await Education.create(educationData);

  return education;
};

/**
 * Get all education records.
 */
export const getAllEducations = async () => {
  const educations = await Education.find().sort({
    current: -1,
    startDate: -1,
    order: 1,
  });

  return educations;
};

/**
 * Get education by ID.
 */
export const getEducationById = async (educationId) => {
  if (!mongoose.Types.ObjectId.isValid(educationId)) {
    throw new ApiError(400, "Invalid education ID");
  }

  const education = await Education.findById(educationId);

  if (!education) {
    throw new ApiError(404, "Education record not found");
  }

  return education;
};

/**
 * Update an education record.
 */
export const updateEducation = async (educationId, educationData) => {
  if (!mongoose.Types.ObjectId.isValid(educationId)) {
    throw new ApiError(400, "Invalid education ID");
  }

  const education = await Education.findById(educationId);

  if (!education) {
    throw new ApiError(404, "Education record not found");
  }

  const institution = educationData.institution ?? education.institution;

  const degree = educationData.degree ?? education.degree;

  const startDate = educationData.startDate ?? education.startDate;

  const existingEducation = await Education.findOne({
    institution,
    degree,
    startDate,
    _id: {
      $ne: educationId,
    },
  });

  if (existingEducation) {
    throw new ApiError(409, "This education record already exists");
  }

  Object.assign(education, educationData);

  await education.save();

  return education;
};

/**
 * Delete an education record.
 */
export const deleteEducation = async (educationId) => {
  if (!mongoose.Types.ObjectId.isValid(educationId)) {
    throw new ApiError(400, "Invalid education ID");
  }

  const education = await Education.findById(educationId);

  if (!education) {
    throw new ApiError(404, "Education record not found");
  }

  await education.deleteOne();

  return {
    id: education._id,
  };
};
