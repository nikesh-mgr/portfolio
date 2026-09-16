import express from "express";

import uploadMiddleware from "../middleware/uploadMiddleware.js";

import authMiddleware from "../middleware/authMiddleware.js";

import asyncHandler from "../utils/asyncHandler.js";

import { uploadProjectImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/project-image",

  authMiddleware,

  uploadMiddleware.single("image"),

  asyncHandler(uploadProjectImage)
);

export default router;
