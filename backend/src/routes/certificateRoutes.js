import express from "express";

import {
  getCertificatesController,
  getCertificateByIdController,
  createCertificateController,
  updateCertificateController,
  uploadCertificateImageController,
  deleteCertificateImageController,
  deleteCertificateController,
} from "../controllers/certificateController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();
router.get(
  "/admin/:id",
  authMiddleware,
  asyncHandler(getCertificateByIdController)
);
router.get("/admin", authMiddleware, asyncHandler(getCertificatesController));

/*
 * Public routes
 */

/**
 * GET /api/certificates
 *
 * Default:
 * only visible certificates.
 *
 * Admin:
 * use ?visible=false to retrieve all certificates.
 */
router.get("/", asyncHandler(getCertificatesController));

/**
 * GET /api/certificates/:id
 */
router.get("/:id", asyncHandler(getCertificateByIdController));

/*
 * Protected admin routes
 */

/**
 * POST /api/certificates
 *
 * Content-Type:
 * multipart/form-data
 *
 * File field:
 * image
 */
router.post(
  "/",
  authMiddleware,
  uploadMiddleware.single("image"),
  asyncHandler(createCertificateController)
);

/**
 * PATCH /api/certificates/:id
 *
 * Content-Type:
 * application/json
 *
 * Image is NOT updated here.
 */
router.patch("/:id", authMiddleware, asyncHandler(updateCertificateController));

/**
 * POST /api/certificates/:id/image
 *
 * Upload or replace certificate image.
 */
router.post(
  "/:id/image",
  authMiddleware,
  uploadMiddleware.single("image"),
  asyncHandler(uploadCertificateImageController)
);

/**
 * DELETE /api/certificates/:id/image
 *
 * Remove certificate image.
 */
router.delete(
  "/:id/image",
  authMiddleware,
  asyncHandler(deleteCertificateImageController)
);

/**
 * DELETE /api/certificates/:id
 *
 * Delete certificate and associated image.
 */
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(deleteCertificateController)
);

export default router;
