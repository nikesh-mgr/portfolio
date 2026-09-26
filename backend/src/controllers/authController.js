import path from "node:path";

import {
  createAdmin,
  loginAdmin,
  getAdminById,
  updateAdminProfileImage as updateAdminProfileImageService,
  removeAdminProfileImage as removeAdminProfileImageService,
  updateAdminResume as updateAdminResumeService,
  deleteAdminResume as deleteAdminResumeService,
} from "../services/authService.js";

import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

import {
  uploadToCloudinary,
  uploadPdfToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";

import { accessTokenCookieOptions } from "../config/cookie.js";

/**
 * Create the initial admin account.
 *
 * Validation and the single-admin restriction are handled by the
 * validator/service respectively.
 */
export const createAdminController = async (req, res) => {
  const admin = await createAdmin(req.body);

  res.status(201).json({
    success: true,
    message: "Admin account created successfully",
    admin,
  });
};

/**
 * Authenticate the admin.
 *
 * The JWT is deliberately returned only as an HTTP-only cookie.
 * It is not included in the JSON response.
 */
export const loginController = async (req, res) => {
  const { admin, accessToken } = await loginAdmin(req.body);

  res.cookie("accessToken", accessToken, accessTokenCookieOptions);

  res.status(200).json({
    success: true,
    message: "Login successful",
    admin,
  });
};

/**
 * Get the currently authenticated admin.
 *
 * req.admin.id is populated by authMiddleware after the JWT has
 * been verified and the admin has been confirmed as active.
 */
export const getCurrentAdminController = async (req, res) => {
  const admin = await getAdminById(req.admin.id);

  res.status(200).json({
    success: true,
    message: "Admin retrieved successfully",
    admin,
  });
};

/**
 * Logout the current admin.
 *
 * Clearing the cookie uses the same security attributes that were
 * used when the cookie was created.
 */
export const logoutController = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: accessTokenCookieOptions.httpOnly,
    secure: accessTokenCookieOptions.secure,
    sameSite: accessTokenCookieOptions.sameSite,
    path: accessTokenCookieOptions.path,
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

/**
 * Upload or replace the admin profile image.
 */
export const updateAdminProfileImage = async (req, res) => {
  let uploadedImage = null;

  try {
    if (!req.file) {
      throw new ApiError(400, "Profile image is required");
    }

    /*
     * The destination folder is hard-coded here.
     *
     * Do not allow the client to provide a Cloudinary folder,
     * resource type, or public ID.
     */
    uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      "portfolio/admin/profile"
    );

    if (!uploadedImage?.secure_url || !uploadedImage?.public_id) {
      throw new ApiError(500, "Profile image upload failed");
    }

    const image = {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    };

    /*
     * Store the new Cloudinary reference in MongoDB before removing
     * the old image. This prevents losing the existing image if the
     * database update fails.
     */
    const { admin, oldImage } = await updateAdminProfileImageService(
      req.admin.id,
      image
    );

    /*
     * The database now points to the new image, so the old image can
     * safely be removed.
     *
     * Failure here does not invalidate the successful database update.
     * It is logged so the orphaned Cloudinary asset can be investigated.
     */
    if (oldImage?.publicId) {
      try {
        await deleteFromCloudinary(oldImage.publicId, "image");
      } catch (error) {
        logger.error(
          {
            err: error,
            publicId: oldImage.publicId,
          },
          "Failed to delete old admin profile image"
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      admin,
    });
  } catch (error) {
    /*
     * If the new image was uploaded but MongoDB failed to store it,
     * remove the new Cloudinary asset to prevent an orphan.
     *
     * This cleanup must never replace the original application error.
     */
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id, "image");
      } catch (cleanupError) {
        logger.error(
          {
            err: cleanupError,
            publicId: uploadedImage.public_id,
          },
          "Failed to clean up uploaded profile image"
        );
      }
    }

    throw error;
  }
};

/**
 * Remove the admin profile image.
 */
export const removeAdminProfileImage = async (req, res) => {
  const { admin, oldImage } = await removeAdminProfileImageService(
    req.admin.id
  );

  /*
   * MongoDB is updated first. If Cloudinary deletion fails, the
   * database remains authoritative and the failure is logged.
   */
  if (oldImage?.publicId) {
    try {
      await deleteFromCloudinary(oldImage.publicId, "image");
    } catch (error) {
      logger.error(
        {
          err: error,
          publicId: oldImage.publicId,
        },
        "Failed to delete admin profile image from Cloudinary"
      );
    }
  }

  res.status(200).json({
    success: true,
    message: "Profile image removed successfully",
    admin,
  });
};

/**
 * Upload or replace the admin resume.
 *
 * Resumes are uploaded as Cloudinary "raw" resources.
 */
export const updateAdminResume = async (req, res) => {
  let uploadedResume = null;

  try {
    if (!req.file) {
      throw new ApiError(400, "Resume PDF is required");
    }

    uploadedResume = await uploadPdfToCloudinary(
      req.file.buffer,
      "portfolio/admin/resume"
    );

    if (!uploadedResume?.secure_url || !uploadedResume?.public_id) {
      throw new ApiError(500, "Resume upload failed");
    }

    /*
     * Multer's originalname comes from the client and must not be
     * treated as a trusted filesystem path.
     *
     * basename() removes any directory component before the value
     * is stored as metadata.
     */
    const originalName = path.basename(req.file.originalname || "resume.pdf");

    const resume = {
      url: uploadedResume.secure_url,
      publicId: uploadedResume.public_id,
      originalName,
    };

    /*
     * Save the new resume reference first.
     */
    const { admin, oldResume } = await updateAdminResumeService(
      req.admin.id,
      resume
    );

    /*
     * Resume files are stored as Cloudinary raw resources.
     *
     * Therefore resource_type MUST remain "raw" for deletion.
     */
    if (oldResume?.publicId) {
      try {
        await deleteFromCloudinary(oldResume.publicId, "raw");
      } catch (error) {
        logger.error(
          {
            err: error,
            publicId: oldResume.publicId,
          },
          "Failed to delete old admin resume from Cloudinary"
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      admin,
    });
  } catch (error) {
    /*
     * If Cloudinary accepted the new resume but the database update
     * failed, remove the newly uploaded raw resource.
     */
    if (uploadedResume?.public_id) {
      try {
        await deleteFromCloudinary(uploadedResume.public_id, "raw");
      } catch (cleanupError) {
        logger.error(
          {
            err: cleanupError,
            publicId: uploadedResume.public_id,
          },
          "Failed to clean up uploaded admin resume"
        );
      }
    }

    throw error;
  }
};

/**
 * Delete the admin resume.
 */
export const deleteAdminResume = async (req, res) => {
  const { resume } = await deleteAdminResumeService(req.admin.id);

  /*
   * The service has already removed the database reference.
   * Delete the corresponding Cloudinary raw resource afterward.
   */
  try {
    await deleteFromCloudinary(resume.publicId, "raw");
  } catch (error) {
    /*
     * Do not expose Cloudinary internals to the client.
     * The failure is logged for cleanup/reconciliation.
     */
    logger.error(
      {
        err: error,
        publicId: resume.publicId,
      },
      "Failed to delete admin resume from Cloudinary"
    );
  }

  res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
};
