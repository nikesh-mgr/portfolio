import mongoose from "mongoose";

import Resume from "../models/Resume.js";
import ApiError from "../utils/ApiError.js";

/**
 * Validate MongoDB ObjectId.
 */
const validateResumeId = (resumeId) => {
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new ApiError(400, "Invalid resume ID");
  }
};

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
  validateResumeId(resumeId);

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return resume;
};

/**
 * Create a new resume.
 *
 * The newly uploaded resume becomes the only active resume.
 */
export const createResume = async (resumeData) => {
  /*
   * Create the new resume first.
   *
   * This is intentionally done before deactivating the old resume.
   * If creation fails, the existing active resume remains active.
   */
  const resume = await Resume.create({
    ...resumeData,
    isActive: true,
  });

  /*
   * Deactivate all other active resumes.
   */
  await Resume.updateMany(
    {
      _id: { $ne: resume._id },
      isActive: true,
    },
    {
      $set: {
        isActive: false,
      },
    }
  );

  return resume;
};

/**
 * Update resume metadata.
 */
export const updateResume = async (resumeId, resumeData) => {
  validateResumeId(resumeId);

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  /*
   * Activating this resume:
   * deactivate every other active resume first.
   */
  if (resumeData.isActive === true) {
    await Resume.updateMany(
      {
        _id: { $ne: resume._id },
        isActive: true,
      },
      {
        $set: {
          isActive: false,
        },
      }
    );
  }

  /*
   * Prevent arbitrary undefined values from being assigned.
   */
  if (resumeData.title !== undefined) {
    resume.title = resumeData.title;
  }

  if (resumeData.isActive !== undefined) {
    resume.isActive = resumeData.isActive;
  }

  await resume.save();

  return resume;
};

/**
 * Delete resume.
 */
export const deleteResume = async (resumeId) => {
  validateResumeId(resumeId);

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  await resume.deleteOne();

  return resume;
};
