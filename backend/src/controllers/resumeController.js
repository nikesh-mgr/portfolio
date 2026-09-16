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
      title: req.body.title || "Resume",

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
        console.error("FAILED TO CLEANUP RESUME:", cleanupError);
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
  const resume = await updateResume(req.params.id, {
    title: req.body.title,
    isActive:
      req.body.isActive !== undefined ? Boolean(req.body.isActive) : undefined,
  });

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
      console.error("FAILED TO DELETE RESUME FROM CLOUDINARY:", error);
    }
  }

  res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
};
