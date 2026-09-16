import mongoose from "mongoose";

import Certificate from "../models/Certificate.js";
import ApiError from "../utils/apiError.js";

export const getAllCertificates = async ({ visibleOnly = false } = {}) => {
  const filter = visibleOnly ? { isVisible: true } : {};

  const certificates = await Certificate.find(filter).sort({
    order: 1,
    issueDate: -1,
    createdAt: -1,
  });

  return certificates;
};

export const getCertificateById = async (certificateId) => {
  if (!mongoose.Types.ObjectId.isValid(certificateId)) {
    throw new ApiError(400, "Invalid certificate ID");
  }

  const certificate = await Certificate.findById(certificateId);

  if (!certificate) {
    throw new ApiError(404, "Certificate not found");
  }

  return certificate;
};

export const createCertificate = async (certificateData) => {
  const certificate = await Certificate.create(certificateData);

  return certificate;
};

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
