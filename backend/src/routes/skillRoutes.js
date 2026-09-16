import express from "express";

import {
  createSkillController,
  getSkills,
  getSkill,
  updateSkillController,
  deleteSkillController,
} from "../controllers/skillController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

/**
 * Public routes.
 */

/**
 * GET /api/skills
 */
router.get("/", asyncHandler(getSkills));

/**
 * GET /api/skills/:id
 */
router.get("/:id", asyncHandler(getSkill));

/**
 * Admin routes.
 */

/**
 * POST /api/skills
 */
router.post("/", authMiddleware, asyncHandler(createSkillController));

/**
 * PATCH /api/skills/:id
 */
router.patch("/:id", authMiddleware, asyncHandler(updateSkillController));

/**
 * DELETE /api/skills/:id
 */
router.delete("/:id", authMiddleware, asyncHandler(deleteSkillController));

export default router;
