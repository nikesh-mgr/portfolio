import {
  createAdmin,
  loginAdmin,
  getAdminById,
  updateAdminProfileImage as updateAdminProfileImageService,
  removeAdminProfileImage as removeAdminProfileImageService,
} from "../services/authService.js";
import ApiError from "../utils/apiError.js";
import logger from "../utils/logger.js";
import { uploadPdfToCloudinary } from "../utils/cloudinaryUpload.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { updateAdminResume as updateAdminResumeService } from "../services/authService.js";
import { deleteAdminResume as deleteAdminResumeService } from "../services/authService.js";
import { accessTokenCookieOptions } from "../config/cookie.js";
import { deleteFromCloudinary } from "../utils/cloudinaryUpload.js";
export const createAdminController = asyncHandler(async (req, res) => {
  const admin = await createAdmin(req.body);

  res.status(201).json({
    success: true,
    message: "Admin account created successfully",
    admin,
  });
});
export const loginController = asyncHandler(async (req, res) => {
  const { admin, accessToken } = await loginAdmin(req.body);

  res.cookie("accessToken", accessToken, accessTokenCookieOptions);

  res.status(200).json({
    success: true,
    message: "Login successful",
    admin,
  });
});
export const getCurrentAdminController = asyncHandler(async (req, res) => {
  const admin = await getAdminById(req.admin.id);

  res.status(200).json({
    success: true,
    message: "Admin retrieved successfully",
    admin,
  });
});
export const logoutController = asyncHandler(async (req, res) => {
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
});
/**
 * Update admin profile image.
 *
 * Admin only.
 */
export const updateAdminProfileImage = async (req, res) => {
  let uploadedImage = null;

  try {
    if (!req.file) {
      throw new ApiError(400, "Profile image is required");
    }

    /**
     * Upload new image to Cloudinary.
     */
    uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      "portfolio/admin/profile"
    );

    const image = {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    };

    /**
     * Update MongoDB.
     */
    const { admin, oldImage } = await updateAdminProfileImageService(
      req.admin.id,
      image
    );

    /**
     * Delete old Cloudinary image only
     * after MongoDB update succeeds.
     */
    if (oldImage?.publicId) {
      try {
        await deleteFromCloudinary(oldImage.publicId);
      } catch {
        // Do not fail successful profile update.
      }
    }

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      admin,
    });
  } catch (error) {
    /**
     * If Cloudinary succeeded but MongoDB
     * update failed, delete the new image.
     */
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id);
      } catch {
        // Keep original error.
      }
    }

    throw error;
  }
};

/**
 * Remove admin profile image.
 *
 * Admin only.
 */
export const removeAdminProfileImage = async (req, res) => {
  const { admin, oldImage } = await removeAdminProfileImageService(
    req.admin.id
  );

  /**
   * Delete image from Cloudinary after
   * MongoDB update succeeds.
   */
  if (oldImage?.publicId) {
    try {
      await deleteFromCloudinary(oldImage.publicId);
    } catch {
      // MongoDB update already succeeded.
    }
  }

  res.status(200).json({
    success: true,
    message: "Profile image removed successfully",
    admin,
  });
};

/**
 * Upload or replace admin resume.
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

    const resume = {
      url: uploadedResume.secure_url,
      publicId: uploadedResume.public_id,
      originalName: req.file.originalname,
    };

    const { admin, oldResume } = await updateAdminResumeService(
      req.admin.id,
      resume
    );

    /**
     * Delete the previous resume only after
     * the database update succeeds.
     */
    if (oldResume?.publicId) {
      try {
        await deleteFromCloudinary(oldResume.publicId, "raw");
      } catch {
        // Do not fail successful resume update.
      }
    }

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      admin,
    });
  } catch (error) {
    /**
     * If Cloudinary upload succeeded but the
     * database update failed, clean up the new file.
     */
    if (uploadedResume?.public_id) {
      try {
        await deleteFromCloudinary(uploadedResume.public_id, "raw");
      } catch {
        // Keep original application error.
      }
    }

    throw error;
  }
};
/**
 * Delete admin resume.
 */
export const deleteAdminResume = async (req, res) => {
  const { resume } = await deleteAdminResumeService(req.admin.id);

  try {
    await deleteFromCloudinary(resume.publicId, "raw");
  } catch (error) {
    // Database has already been updated.
    // Log Cloudinary cleanup failure but don't
    // turn a successful delete into a 500 response.
    logger.error(
      {
        err: error,
        publicId: resume.publicId,
      },
      "Failed to delete resume from Cloudinary"
    );
  }

  res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
};
