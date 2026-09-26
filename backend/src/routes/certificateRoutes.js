import express from "express";

import {
  createCertificateController,
  deleteCertificateController,
  deleteCertificateImageController,
  getAdminCertificateByIdController,
  getAdminCertificatesController,
  getCertificateByIdController,
  getCertificatesController,
  updateCertificateController,
  uploadCertificateImageController,
} from "../controllers/certificateController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Certificate Routes
|--------------------------------------------------------------------------
*/

/**
 * GET /api/certificates
 *
 * Returns only visible certificates.
 */
router.get("/", asyncHandler(getCertificatesController));

/*
|--------------------------------------------------------------------------
| Admin Certificate Routes
|--------------------------------------------------------------------------
|
| IMPORTANT:
| These routes MUST appear before `/:id`.
|
| Otherwise Express interprets:
|
| GET /api/certificates/admin
|
| as:
|
| GET /api/certificates/:id
|
| with `id = "admin"`.
|--------------------------------------------------------------------------
*/

/**
 * GET /api/certificates/admin
 *
 * Returns both visible and hidden certificates.
 */
router.get(
  "/admin",
  authMiddleware,
  asyncHandler(getAdminCertificatesController)
);

/**
 * GET /api/certificates/admin/:id
 *
 * Returns any certificate for authenticated admin.
 */
router.get(
  "/admin/:id",
  authMiddleware,
  asyncHandler(getAdminCertificateByIdController)
);

/*
|--------------------------------------------------------------------------
| Public Certificate Detail
|--------------------------------------------------------------------------
*/

/**
 * GET /api/certificates/:id
 *
 * Returns a certificate only when it is visible.
 */
router.get("/:id", asyncHandler(getCertificateByIdController));

/*
|--------------------------------------------------------------------------
| Admin Certificate Creation
|--------------------------------------------------------------------------
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

/*
|--------------------------------------------------------------------------
| Admin Certificate Update
|--------------------------------------------------------------------------
*/

/**
 * PATCH /api/certificates/:id
 *
 * Updates certificate metadata.
 *
 * Image is handled separately through:
 * POST /:id/image
 */
router.patch("/:id", authMiddleware, asyncHandler(updateCertificateController));

/*
|--------------------------------------------------------------------------
| Certificate Image
|--------------------------------------------------------------------------
*/

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
 * Delete certificate image.
 */
router.delete(
  "/:id/image",
  authMiddleware,
  asyncHandler(deleteCertificateImageController)
);

/*
|--------------------------------------------------------------------------
| Certificate Delete
|--------------------------------------------------------------------------
*/

/**
 * DELETE /api/certificates/:id
 *
 * Delete certificate and its Cloudinary image.
 */
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(deleteCertificateController)
);

export default router;
