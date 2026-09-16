import express from "express";

import {
  getSettings,
  createSettings,
  updateSettings,
  deleteSettings,
} from "../controllers/siteSettingsController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

/**
 * Public route.
 */
router.get("/", asyncHandler(getSettings));

/**
 * Admin routes.
 */
router.post("/", authMiddleware, asyncHandler(createSettings));

router.patch("/", authMiddleware, asyncHandler(updateSettings));

router.delete("/", authMiddleware, asyncHandler(deleteSettings));

export default router;
