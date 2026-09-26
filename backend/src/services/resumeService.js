import resumeTransaction from "../utils/resumeTransaction.js";
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
export const createResume = async (resumeData) =>
  resumeTransaction(async (session) => {
    await Resume.updateMany(
      { isActive: true },
      { $set: { isActive: false } },
      { session }
    );
    const [resume] = await Resume.create([{ ...resumeData, isActive: true }], {
      session,
    });
    return resume;
  });

/**
 * Update resume.
 */
export const updateResume = async (resumeId, resumeData) => {
  if (!mongoose.isObjectIdOrHexString(resumeId))
    throw new ApiError(400, "Invalid resume ID");
  return resumeTransaction(async (session) => {
    const resume = await Resume.findById(resumeId).session(session);
    if (!resume) throw new ApiError(404, "Resume not found");
    if (resumeData.isActive === true) {
      await Resume.updateMany(
        { _id: { $ne: resumeId }, isActive: true },
        { $set: { isActive: false } },
        { session }
      );
    }
    Object.assign(resume, resumeData);
    await resume.save({ session });
    return resume;
  });
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
