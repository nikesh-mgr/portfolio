import api from "./axios";

export const getCertificates = async ({ visible = true } = {}) => {
  const response = await api.get(visible ? "/certificates" : "/certificates/admin", {
    params: {
      visible,
    },
  });

  return response.data;
};

export const getCertificateById = async (id) => {
  const response = await api.get(`/certificates/${id}`);

  return response.data;
};

export const createCertificate = async ({ data, image }) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("issuer", data.issuer);
  formData.append("issueDate", data.issueDate);
  formData.append("credentialId", data.credentialId || "");
  formData.append("credentialUrl", data.credentialUrl || "");
  formData.append("description", data.description || "");
  formData.append("order", String(data.order ?? 0));
  formData.append("isVisible", String(data.isVisible));

  if (image) {
    formData.append("image", image);
  }

  const response = await api.post("/certificates", formData);

  return response.data;
};

export const updateCertificate = async (id, data) => {
  const response = await api.patch(`/certificates/${id}`, {
    title: data.title,
    issuer: data.issuer,
    issueDate: data.issueDate,
    credentialId: data.credentialId || null,
    credentialUrl: data.credentialUrl || null,
    description: data.description || null,
    order: Number(data.order ?? 0),
    isVisible: Boolean(data.isVisible),
  });

  return response.data;
};

export const uploadCertificateImage = async (id, image) => {
  const formData = new FormData();

  formData.append("image", image);

  const response = await api.post(`/certificates/${id}/image`, formData);

  return response.data;
};

export const deleteCertificateImage = async (id) => {
  const response = await api.delete(`/certificates/${id}/image`);

  return response.data;
};

export const deleteCertificate = async (id) => {
  const response = await api.delete(`/certificates/${id}`);

  return response.data;
};
