import logger from "../utils/logger.js";
import {
  getAllCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  updateCertificateImage,
  deleteCertificate,
} from "../services/certificateService.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";

import ApiError from "../utils/apiError.js";

import {
  createCertificateSchema,
  updateCertificateSchema,
  normalizeCertificateData,
} from "../validators/certificateValidator.js";

/**
 * GET /api/certificates
 */
export const getCertificatesController = async (req, res) => {
  const visibleOnly = !req.admin;

  const certificates = await getAllCertificates({
    visibleOnly,
  });

  res.status(200).json({
    success: true,
    count: certificates.length,
    certificates,
  });
};

/**
 * GET /api/certificates/:id
 */
export const getCertificateByIdController = async (req, res) => {
  const certificate = await getCertificateById(req.params.id);
  if (!req.admin && !certificate.isVisible)
    throw new ApiError(404, "Certificate not found");

  res.status(200).json({
    success: true,
    certificate,
  });
};

/**
 * POST /api/certificates
 */
export const createCertificateController = async (req, res) => {
  let uploadedImage = null;

  try {
    const certificateData = normalizeCertificateData(req.body);

    const validation = createCertificateSchema.safeParse(certificateData);

    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message,
      }));

      throw new ApiError(400, "Validation failed", errors);
    }

    if (req.file) {
      uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "portfolio/certificates"
      );

      if (!uploadedImage?.secure_url || !uploadedImage?.public_id) {
        throw new ApiError(500, "Certificate image upload failed");
      }

      validation.data.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        width: uploadedImage.width || null,
        height: uploadedImage.height || null,
        format: uploadedImage.format || null,
      };
    }

    const certificate = await createCertificate(validation.data);

    res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      certificate,
    });
  } catch (error) {
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id);
      } catch (cleanupError) {
        logger.error(
          { err: cleanupError },
          "FAILED TO CLEANUP CERTIFICATE IMAGE:"
        );
      }
    }

    throw error;
  }
};

/**
 * PATCH /api/certificates/:id
 */
export const updateCertificateController = async (req, res) => {
  const updateData = normalizeCertificateData(req.body);

  /*
   * Do not accidentally overwrite fields
   * that were not provided.
   */
  Object.keys(updateData).forEach((key) => {
    if (req.body[key] === undefined && key !== "order" && key !== "isVisible") {
      delete updateData[key];
    }
  });

  /*
   * Image must be handled by the dedicated
   * image endpoints.
   */
  delete updateData.image;

  const validation = updateCertificateSchema.safeParse(updateData);

  if (!validation.success) {
    const errors = validation.error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));

    throw new ApiError(400, "Validation failed", errors);
  }

  const updatedCertificate = await updateCertificate(
    req.params.id,
    validation.data
  );

  res.status(200).json({
    success: true,
    message: "Certificate updated successfully",
    certificate: updatedCertificate,
  });
};

/**
 * POST /api/certificates/:id/image
 */
export const uploadCertificateImageController = async (req, res) => {
  let uploadedImage = null;

  try {
    if (!req.file) {
      throw new ApiError(400, "Certificate image file is required");
    }

    const existingCertificate = await getCertificateById(req.params.id);

    uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      "portfolio/certificates"
    );

    if (!uploadedImage?.secure_url || !uploadedImage?.public_id) {
      throw new ApiError(500, "Certificate image upload failed");
    }

    const image = {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      width: uploadedImage.width || null,
      height: uploadedImage.height || null,
      format: uploadedImage.format || null,
    };

    const certificate = await updateCertificateImage(req.params.id, image);

    /*
     * Delete old image only after the database
     * has successfully stored the new image.
     */
    if (existingCertificate.image?.publicId) {
      try {
        await deleteFromCloudinary(existingCertificate.image.publicId);
      } catch (error) {
        logger.error({ err: error }, "FAILED TO DELETE OLD CERTIFICATE IMAGE:");
      }
    }

    res.status(200).json({
      success: true,
      message: "Certificate image uploaded successfully",
      certificate,
    });
  } catch (error) {
    /*
     * Prevent orphaned Cloudinary files if the
     * database operation fails.
     */
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id);
      } catch (cleanupError) {
        logger.error(
          { err: cleanupError },
          "FAILED TO CLEANUP NEW CERTIFICATE IMAGE:"
        );
      }
    }

    throw error;
  }
};

/**
 * DELETE /api/certificates/:id/image
 */
export const deleteCertificateImageController = async (req, res) => {
  const certificate = await getCertificateById(req.params.id);
  if (!req.admin && !certificate.isVisible)
    throw new ApiError(404, "Certificate not found");

  if (!certificate.image?.publicId) {
    throw new ApiError(404, "Certificate image not found");
  }

  const publicId = certificate.image.publicId;

  await updateCertificateImage(req.params.id, {
    url: null,
    publicId: null,
    width: null,
    height: null,
    format: null,
  });

  try {
    await deleteFromCloudinary(publicId);
  } catch (error) {
    logger.error({ err: error }, "FAILED TO DELETE CERTIFICATE IMAGE:");
  }

  res.status(200).json({
    success: true,
    message: "Certificate image deleted successfully",
  });
};

/**
 * DELETE /api/certificates/:id
 */
export const deleteCertificateController = async (req, res) => {
  const certificate = await getCertificateById(req.params.id);
  if (!req.admin && !certificate.isVisible)
    throw new ApiError(404, "Certificate not found");

  await deleteCertificate(req.params.id);

  if (certificate.image?.publicId) {
    try {
      await deleteFromCloudinary(certificate.image.publicId);
    } catch (error) {
      logger.error({ err: error }, "FAILED TO DELETE CERTIFICATE IMAGE:");
    }
  }

  res.status(200).json({
    success: true,
    message: "Certificate deleted successfully",
  });
};
