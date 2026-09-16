import api from "./axios";

export const sendContactMessage = async (messageData) => {
  const response = await api.post("/contact", messageData);

  return response.data;
};

export const getContactMessages = async () => {
  const response = await api.get("/contact");

  return response.data;
};

export const getContactMessageById = async (id) => {
  const response = await api.get(`/contact/${id}`);

  return response.data;
};

export const updateContactMessageStatus = async (id, status) => {
  const response = await api.patch(`/contact/${id}/status`, {
    status,
  });

  return response.data;
};
export const updateContactReadStatus = async (id, isRead) => {
  const response = await api.patch(`/contact/${id}/read`, {
    isRead,
  });

  return response.data;
};
export const deleteContactMessage = async (id) => {
  const response = await api.delete(`/contact/${id}`);

  return response.data;
};
