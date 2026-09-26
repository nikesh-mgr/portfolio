import express from "express";

import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  updateContactReadStatus,
} from "../controllers/contactController.js";
import { contactRateLimiter } from "../middleware/rateLimiter.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validateMiddleware from "../middleware/validateMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

import { createContactSchema } from "../validators/contactValidator.js";

import { updateContactStatusSchema } from "../validators/contactStatusValidator.js";

const router = express.Router();

/*
 * Public
 */
router.post(
  "/",
  contactRateLimiter,
  validateMiddleware(createContactSchema),
  asyncHandler(createContact)
);
/*
 * Admin
 */
router.get("/", authMiddleware, asyncHandler(getAllContacts));

router.get("/:id", authMiddleware, asyncHandler(getContactById));

router.patch(
  "/:id/status",
  authMiddleware,
  validateMiddleware(updateContactStatusSchema),
  asyncHandler(updateContactStatus)
);
router.patch(
  "/:id/read",
  authMiddleware,

  asyncHandler(updateContactReadStatus)
);
router.delete("/:id", authMiddleware, asyncHandler(deleteContact));

export default router;
