import Contact from "../models/Contact.js";
import ApiError from "../utils/apiError.js";
import { sendContactEmail } from "./emailService.js";
import logger from "../utils/logger.js";

/**
 * Create a new contact message.
 */
export const createContact = async ({
  name,
  email,
  subject,
  message,
  ipAddress,
  userAgent,
}) => {
  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
    ipAddress,
    userAgent,
    status: "new",
  });

  try {
    await sendContactEmail({
      name,
      email,
      subject,
      message,
    });
  } catch (error) {
    logger.error(
      {
        err: error,
        contactId: contact._id,
      },
      "Failed to send contact email"
    );
  }

  return {
    id: contact._id,
    name: contact.name,
    email: contact.email,
    subject: contact.subject,
    message: contact.message,
    status: contact.status,
    createdAt: contact.createdAt,
  };
};

/**
 * Get all contact messages.
 */
export const getAllContacts = async () => {
  const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

  return contacts;
};

/**
 * Get a contact message by ID.
 */
export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId).lean();

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  return contact;
};

/**
 * Update contact message status.
 */
export const updateContactStatus = async (contactId, status) => {
  const allowedStatuses = ["new", "read", "replied", "archived"];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid contact status");
  }

  const updateData = {
    status,
  };

  if (status === "replied") {
    updateData.repliedAt = new Date();
  }

  if (status !== "replied") {
    updateData.repliedAt = null;
  }

  const contact = await Contact.findByIdAndUpdate(contactId, updateData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  return contact;
};

/**
 * Delete a contact message.
 */
export const deleteContact = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId).lean();

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  return contact;
};
export const updateContactReadStatus = async (id, isRead) => {
  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  contact.isRead = isRead;

  await contact.save();

  return contact;
};
