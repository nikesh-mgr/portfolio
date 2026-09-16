import mongoose from "mongoose";

import Resume from "../models/Resume.js";
import ApiError from "../utils/apiError.js";

/**
 * Get the active resume.
 */
export const getResume = async () => {
  const resume = await Resume.findOne({
    isActive: true,
  }).sort({
    createdAt: -1,
  });

  return resume;
};

/**
 * Get resume by ID.
 */
export const getResumeById = async (resumeId) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new ApiError(400, "Invalid resume ID");
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return resume;
};

/**
 * Create resume.
 */
export const createResume = async (resumeData) => {
  /*
   * Only one active resume should exist.
   */
  await Resume.updateMany(
    { isActive: true },
    {
      $set: {
        isActive: false,
      },
    }
  );

  const resume = await Resume.create({
    ...resumeData,
    isActive: true,
  });

  return resume;
};

/**
 * Update resume.
 */
export const updateResume = async (resumeId, resumeData) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new ApiError(400, "Invalid resume ID");
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  Object.assign(resume, resumeData);

  await resume.save();

  return resume;
};

/**
 * Delete resume.
 */
export const deleteResume = async (resumeId) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new ApiError(400, "Invalid resume ID");
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  await resume.deleteOne();

  return resume;
};
