import {
  createContact as createContactService,
  getAllContacts as getAllContactsService,
  getContactById as getContactByIdService,
  updateContactStatus as updateContactStatusService,
  deleteContact as deleteContactService,
  updateContactReadStatus as updateContactReadStatusService,
} from "../services/contactService.js";

/**
 * Create contact message.
 */
export const createContact = async (req, res) => {
  const contact = await createContactService({
    ...req.body,

    ipAddress:
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,

    userAgent: req.get("user-agent"),
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    contact: {
      id: contact.id,
      name: contact.name,
      subject: contact.subject,
      createdAt: contact.createdAt,
    },
  });
};

/**
 * Get all contact messages.
 */
export const getAllContacts = async (req, res) => {
  const contacts = await getAllContactsService();

  res.status(200).json({
    success: true,
    count: contacts.length,
    contacts,
  });
};

/**
 * Get contact message by ID.
 */
export const getContactById = async (req, res) => {
  const contact = await getContactByIdService(req.params.id);

  res.status(200).json({
    success: true,
    contact,
  });
};

/**
 * Update contact message status.
 */
export const updateContactStatus = async (req, res) => {
  const contact = await updateContactStatusService(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Contact status updated successfully",
    contact,
  });
};

/**
 * Delete contact message.
 */
export const deleteContact = async (req, res) => {
  await deleteContactService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Contact message deleted successfully",
  });
};
/**
 * Update contact message read status.
 */
export const updateContactReadStatus = async (req, res) => {
  const contact = await updateContactReadStatusService(
    req.params.id,
    req.body.isRead
  );

  res.status(200).json({
    success: true,
    message: contact.isRead
      ? "Message marked as read"
      : "Message marked as unread",
    contact,
  });
};
