import logger from "../utils/logger.js";
import { parseInput } from "../validators/input.js";
import { resumeMetadataSchema } from "../validators/resumeValidator.js";
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

import ApiError from "../utils/apiError.js";

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
    const metadata = parseInput(resumeMetadataSchema, req.body);
    if (!req.file) {
      throw new ApiError(400, "Resume PDF file is required");
    }

    /*
     * Upload PDF to Cloudinary.
     */
    uploadedFile = await uploadPdfToCloudinary(
      req.file.buffer,
      "portfolio/resume"
    );

    if (!uploadedFile?.secure_url || !uploadedFile?.public_id) {
      throw new ApiError(500, "Resume upload failed");
    }

    /*
     * Create database record.
     */
    const resume = await createResume({
      title: metadata.title || "Resume",

      file: {
        url: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
        format: uploadedFile.format || "pdf",
        size: req.file.size,
      },
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    /*
     * Cloudinary succeeded but MongoDB failed.
     * Remove uploaded file.
     */
    if (uploadedFile?.public_id) {
      try {
        await deleteFromCloudinary(uploadedFile.public_id, "raw");
      } catch (cleanupError) {
        logger.error({ err: cleanupError }, "FAILED TO CLEANUP RESUME:");
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
  const resume = await updateResume(
    req.params.id,
    parseInput(resumeMetadataSchema, req.body)
  );

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

  /*
   * Delete database record first.
   */
  await deleteResume(req.params.id);

  /*
   * Delete Cloudinary PDF.
   */
  if (resume.file?.publicId) {
    try {
      await deleteFromCloudinary(resume.file.publicId, "raw");
    } catch (error) {
      logger.error({ err: error }, "FAILED TO DELETE RESUME FROM CLOUDINARY:");
    }
  }

  res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
};
