import mongoose from "mongoose";

import Certificate from "../models/Certificate.js";
import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Get All Certificates
|--------------------------------------------------------------------------
|
| Public requests should use `visibleOnly: true`.
| Admin requests can use the default `false` value to retrieve both
| visible and hidden certificates.
|--------------------------------------------------------------------------
*/

export const getAllCertificates = async ({ visibleOnly = false } = {}) => {
  const filter = visibleOnly ? { isVisible: true } : {};

  const certificates = await Certificate.find(filter).sort({
    order: 1,
    issueDate: -1,
    createdAt: -1,
  });

  return certificates;
};

/*
|--------------------------------------------------------------------------
| Get Certificate By ID
|--------------------------------------------------------------------------
|
| `visibleOnly` allows the same service method to safely serve both:
|
| - Public detail requests: only visible certificates.
| - Admin detail requests: visible + hidden certificates.
|--------------------------------------------------------------------------
*/

export const getCertificateById = async (
  certificateId,
  { visibleOnly = false } = {}
) => {
  if (!mongoose.Types.ObjectId.isValid(certificateId)) {
    throw new ApiError(400, "Invalid certificate ID");
  }

  const filter = visibleOnly
    ? {
        _id: certificateId,
        isVisible: true,
      }
    : {
        _id: certificateId,
      };

  const certificate = await Certificate.findOne(filter);

  if (!certificate) {
    throw new ApiError(404, "Certificate not found");
  }

  return certificate;
};

/*
|--------------------------------------------------------------------------
| Create Certificate
|--------------------------------------------------------------------------
*/

export const createCertificate = async (certificateData) => {
  const certificate = await Certificate.create(certificateData);

  return certificate;
};

/*
|--------------------------------------------------------------------------
| Update Certificate
|--------------------------------------------------------------------------
|
| The controller/validator is responsible for validating and normalizing
| the update payload. Object.assign() applies only the fields supplied
| by the PATCH request.
|--------------------------------------------------------------------------
*/

export const updateCertificate = async (certificateId, certificateData) => {
  if (!mongoose.Types.ObjectId.isValid(certificateId)) {
    throw new ApiError(400, "Invalid certificate ID");
  }

  const certificate = await Certificate.findById(certificateId);

  if (!certificate) {
    throw new ApiError(404, "Certificate not found");
  }

  Object.assign(certificate, certificateData);

  await certificate.save();

  return certificate;
};

/*
|--------------------------------------------------------------------------
| Update Certificate Image
|--------------------------------------------------------------------------
|
| The image object should contain the Cloudinary metadata required by
| the Certificate model.
|--------------------------------------------------------------------------
*/

export const updateCertificateImage = async (certificateId, image) => {
  if (!mongoose.Types.ObjectId.isValid(certificateId)) {
    throw new ApiError(400, "Invalid certificate ID");
  }

  const certificate = await Certificate.findById(certificateId);

  if (!certificate) {
    throw new ApiError(404, "Certificate not found");
  }

  certificate.image = image;

  await certificate.save();

  return certificate;
};

/*
|--------------------------------------------------------------------------
| Delete Certificate
|--------------------------------------------------------------------------
*/

export const deleteCertificate = async (certificateId) => {
  if (!mongoose.Types.ObjectId.isValid(certificateId)) {
    throw new ApiError(400, "Invalid certificate ID");
  }

  const certificate = await Certificate.findById(certificateId);

  if (!certificate) {
    throw new ApiError(404, "Certificate not found");
  }

  await certificate.deleteOne();

  return certificate;
};
