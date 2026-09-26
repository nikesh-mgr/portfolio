import {
  getResume,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} from "../services/resumeService.js";

import {
  uploadPdfToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";

import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

/**
 * Parse a boolean value safely.
 *
 * Multipart/form-data sends values as strings.
 */
const parseBoolean = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new ApiError(400, "isActive must be a boolean");
};

/**
 * Normalize resume title.
 */
const parseTitle = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ApiError(400, "Resume title must be a string");
  }

  const title = value.trim();

  if (!title) {
    throw new ApiError(400, "Resume title cannot be empty");
  }

  if (title.length > 100) {
    throw new ApiError(400, "Resume title cannot exceed 100 characters");
  }

  return title;
};

/**
 * GET /api/resume
 *
 * Public active resume.
 */
export const getResumeController = async (req, res) => {
  const resume = await getResume();

  res.status(200).json({
    success: true,
    resume,
  });
};

/**
 * POST /api/resume
 *
 * Admin upload resume.
 */
export const uploadResumeController = async (req, res) => {
  let uploadedFile = null;

  try {
    if (!req.file) {
      throw new ApiError(400, "Resume PDF file is required");
    }

    const title = parseTitle(req.body.title) || "Resume";

    uploadedFile = await uploadPdfToCloudinary(
      req.file.buffer,
      "portfolio/resume"
    );

    if (!uploadedFile?.secure_url || !uploadedFile?.public_id) {
      throw new ApiError(500, "Resume upload failed");
    }

    const resume = await createResume({
      title,
      file: {
        url: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
        format: "pdf",
        size: req.file.size,
      },
    });

    uploadedFile = null;

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    /*
     * Cloudinary succeeded but database creation failed.
     * Clean up the uploaded file.
     */
    if (uploadedFile?.public_id) {
      try {
        await deleteFromCloudinary(uploadedFile.public_id, "raw");
      } catch (cleanupError) {
        logger.error(
          {
            err: cleanupError,
            publicId: uploadedFile.public_id,
          },
          "Failed to cleanup uploaded resume from Cloudinary"
        );
      }
    }

    throw error;
  }
};

/**
 * PATCH /api/resume/:id
 *
 * Update resume metadata.
 */
export const updateResumeController = async (req, res) => {
  const title = parseTitle(req.body.title);
  const isActive = parseBoolean(req.body.isActive);

  const resumeData = {};

  if (title !== undefined) {
    resumeData.title = title;
  }

  if (isActive !== undefined) {
    resumeData.isActive = isActive;
  }

  if (Object.keys(resumeData).length === 0) {
    throw new ApiError(400, "No valid resume fields provided");
  }

  const resume = await updateResume(req.params.id, resumeData);

  res.status(200).json({
    success: true,
    message: "Resume updated successfully",
    resume,
  });
};

/**
 * DELETE /api/resume/:id
 *
 * Delete resume and Cloudinary file.
 */
export const deleteResumeController = async (req, res) => {
  const resume = await getResumeById(req.params.id);

  await deleteResume(req.params.id);

  /*
   * Delete the associated Cloudinary PDF.
   *
   * Database deletion is already complete, so a Cloudinary
   * failure should not make the API return a false failure.
   */
  if (resume.file?.publicId) {
    try {
      await deleteFromCloudinary(resume.file.publicId, "raw");
    } catch (error) {
      logger.error(
        {
          err: error,
          publicId: resume.file.publicId,
          resumeId: resume._id.toString(),
        },
        "Failed to delete resume from Cloudinary"
      );
    }
  }

  res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
};
