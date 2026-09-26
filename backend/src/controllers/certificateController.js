import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinaryUpload.js";
import logger from "../utils/logger.js";

import {
  createCertificate,
  deleteCertificate,
  getAllCertificates,
  getCertificateById,
  updateCertificate,
  updateCertificateImage,
} from "../services/certificateService.js";

import {
  createCertificateSchema,
  normalizeCertificateData,
  updateCertificateSchema,
} from "../validators/certificateValidator.js";

import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Public: Get Visible Certificates
|--------------------------------------------------------------------------
|
| Public users must never be able to request hidden certificates.
| Visibility is enforced here rather than through a client-controlled
| query parameter.
|--------------------------------------------------------------------------
*/

export const getCertificatesController = async (req, res) => {
  const certificates = await getAllCertificates({
    visibleOnly: true,
  });

  return res.status(200).json({
    success: true,
    data: certificates,
  });
};

/*
|--------------------------------------------------------------------------
| Admin: Get All Certificates
|--------------------------------------------------------------------------
|
| Authentication is enforced by the route middleware.
| This endpoint intentionally returns both visible and hidden certificates.
|--------------------------------------------------------------------------
*/

export const getAdminCertificatesController = async (req, res) => {
  const certificates = await getAllCertificates({
    visibleOnly: false,
  });

  return res.status(200).json({
    success: true,
    data: certificates,
  });
};

/*
|--------------------------------------------------------------------------
| Public: Get Visible Certificate By ID
|--------------------------------------------------------------------------
*/

export const getCertificateByIdController = async (req, res) => {
  const certificate = await getCertificateById(req.params.id, {
    visibleOnly: true,
  });

  return res.status(200).json({
    success: true,
    data: certificate,
  });
};

/*
|--------------------------------------------------------------------------
| Admin: Get Certificate By ID
|--------------------------------------------------------------------------
*/

export const getAdminCertificateByIdController = async (req, res) => {
  const certificate = await getCertificateById(req.params.id, {
    visibleOnly: false,
  });

  return res.status(200).json({
    success: true,
    data: certificate,
  });
};

/*
|--------------------------------------------------------------------------
| Create Certificate
|--------------------------------------------------------------------------
|
| Certificate data and the optional image arrive through multipart/form-data.
|
| Cloudinary upload happens before the database write because the database
| record needs the resulting image metadata.
|
| If database creation fails, the newly uploaded image is removed so we
| don't intentionally leave an orphaned Cloudinary asset.
|--------------------------------------------------------------------------
*/

export const createCertificateController = async (req, res) => {
  const normalizedData = normalizeCertificateData(req.body);

  const validationResult = createCertificateSchema.safeParse(normalizedData);

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    throw new ApiError(400, "Validation failed", errors);
  }

  let uploadedImage = null;

  try {
    if (req.file) {
      uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "portfolio/certificates"
      );

      normalizedData.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        width: uploadedImage.width ?? null,
        height: uploadedImage.height ?? null,
        format: uploadedImage.format ?? null,
      };
    }

    const certificate = await createCertificate(normalizedData);

    return res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      data: certificate,
    });
  } catch (error) {
    /*
     * The database write failed after a Cloudinary upload.
     * Remove only the newly uploaded asset.
     */
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id);
      } catch (cleanupError) {
        logger.error(
          {
            error: cleanupError,
            publicId: uploadedImage.public_id,
          },
          "Failed to clean up certificate image after create failure"
        );
      }
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Update Certificate
|--------------------------------------------------------------------------
|
| PATCH semantics are preserved:
| only fields actually supplied by the client are changed.
|
| Image replacement is intentionally handled by the dedicated image
| endpoint, so this method does not modify the certificate image.
|--------------------------------------------------------------------------
*/

export const updateCertificateController = async (req, res) => {
  const normalizedData = normalizeCertificateData(req.body, {
    partial: true,
  });

  const validationResult = updateCertificateSchema.safeParse(normalizedData);

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    throw new ApiError(400, "Validation failed", errors);
  }

  const certificate = await updateCertificate(
    req.params.id,
    validationResult.data
  );

  return res.status(200).json({
    success: true,
    message: "Certificate updated successfully",
    data: certificate,
  });
};

/*
|--------------------------------------------------------------------------
| Upload / Replace Certificate Image
|--------------------------------------------------------------------------
|
| Important failure-handling rule:
|
| 1. Upload new image.
| 2. Save new image reference in MongoDB.
| 3. Only after MongoDB succeeds, attempt to delete the old image.
|
| If deleting the old Cloudinary image fails, we DO NOT delete the new
| image because MongoDB is already pointing to it.
|
| This prevents the database from referencing a deleted Cloudinary asset.
|--------------------------------------------------------------------------
*/

export const uploadCertificateImageController = async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Certificate image is required");
  }

  const certificate = await getCertificateById(req.params.id);

  const oldImage = certificate.image?.publicId
    ? {
        publicId: certificate.image.publicId,
      }
    : null;

  let uploadedImage = null;

  try {
    uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      "portfolio/certificates"
    );
  } catch (error) {
    throw error;
  }

  const newImage = {
    url: uploadedImage.secure_url,
    publicId: uploadedImage.public_id,
    width: uploadedImage.width ?? null,
    height: uploadedImage.height ?? null,
    format: uploadedImage.format ?? null,
  };

  /*
   * Only clean up the new image if the database update fails.
   */
  try {
    const updatedCertificate = await updateCertificateImage(
      req.params.id,
      newImage
    );

    /*
     * The database now safely references the new image.
     * Failure here must not remove the new image.
     */
    if (oldImage?.publicId && oldImage.publicId !== newImage.publicId) {
      try {
        await deleteFromCloudinary(oldImage.publicId);
      } catch (cleanupError) {
        logger.error(
          {
            error: cleanupError,
            publicId: oldImage.publicId,
            certificateId: req.params.id,
          },
          "Failed to delete old certificate image after replacement"
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Certificate image updated successfully",
      data: updatedCertificate,
    });
  } catch (error) {
    /*
     * MongoDB update failed, so the new Cloudinary asset is no longer
     * referenced by the database and should be cleaned up.
     */
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id);
      } catch (cleanupError) {
        logger.error(
          {
            error: cleanupError,
            publicId: uploadedImage.public_id,
            certificateId: req.params.id,
          },
          "Failed to clean up new certificate image after update failure"
        );
      }
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Delete Certificate Image
|--------------------------------------------------------------------------
|
| MongoDB is updated first so the application no longer references the
| image. Cloudinary cleanup happens afterward.
|
| If Cloudinary cleanup fails, the database remains internally consistent
| and the failed cleanup can be logged/retried separately.
|--------------------------------------------------------------------------
*/

export const deleteCertificateImageController = async (req, res) => {
  const certificate = await getCertificateById(req.params.id);

  const oldPublicId = certificate.image?.publicId ?? null;

  const updatedCertificate = await updateCertificateImage(req.params.id, {
    url: null,
    publicId: null,
    width: null,
    height: null,
    format: null,
  });

  if (oldPublicId) {
    try {
      await deleteFromCloudinary(oldPublicId);
    } catch (error) {
      logger.error(
        {
          error,
          publicId: oldPublicId,
          certificateId: req.params.id,
        },
        "Failed to delete certificate image from Cloudinary"
      );
    }
  }

  return res.status(200).json({
    success: true,
    message: "Certificate image deleted successfully",
    data: updatedCertificate,
  });
};

/*
|--------------------------------------------------------------------------
| Delete Certificate
|--------------------------------------------------------------------------
|
| The database record is deleted first. The associated Cloudinary asset
| is then removed.
|--------------------------------------------------------------------------
*/

export const deleteCertificateController = async (req, res) => {
  const certificate = await getCertificateById(req.params.id);

  const publicId = certificate.image?.publicId ?? null;

  await deleteCertificate(req.params.id);

  if (publicId) {
    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      logger.error(
        {
          error,
          publicId,
          certificateId: req.params.id,
        },
        "Failed to delete certificate image after certificate deletion"
      );
    }
  }

  return res.status(200).json({
    success: true,
    message: "Certificate deleted successfully",
  });
};
