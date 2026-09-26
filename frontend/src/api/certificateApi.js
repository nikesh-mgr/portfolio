import api from "./axios";

/*
|--------------------------------------------------------------------------
| Public Certificate APIs
|--------------------------------------------------------------------------
*/

/**
 * Get certificates visible on the public portfolio.
 */
export const getCertificates = async () => {
  const response = await api.get("/certificates");

  return response.data;
};

/**
 * Get a single visible certificate by ID.
 *
 * This endpoint is public and the backend ensures hidden certificates
 * cannot be returned.
 */
export const getCertificateById = async (id) => {
  if (!id) {
    throw new Error("Certificate ID is required.");
  }

  const response = await api.get(`/certificates/${id}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Admin Certificate APIs
|--------------------------------------------------------------------------
*/

/**
 * Get all certificates for the admin dashboard.
 *
 * This includes both visible and hidden certificates.
 */
export const getAdminCertificates = async () => {
  const response = await api.get("/certificates/admin");

  return response.data;
};

/**
 * Get any certificate by ID from the authenticated admin endpoint.
 */
export const getAdminCertificateById = async (id) => {
  if (!id) {
    throw new Error("Certificate ID is required.");
  }

  const response = await api.get(`/certificates/admin/${id}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Create Certificate
|--------------------------------------------------------------------------
|
| Certificate creation uses multipart/form-data because the certificate
| image is uploaded together with the certificate data.
|
| Do not manually set Content-Type here. Axios/browser will automatically
| generate the correct multipart boundary.
|--------------------------------------------------------------------------
*/

export const createCertificate = async ({ data, image }) => {
  if (!data || typeof data !== "object") {
    throw new Error("Certificate data is required.");
  }

  if (image !== null && image !== undefined) {
    if (!(image instanceof File)) {
      throw new Error("Certificate image must be a valid file.");
    }
  }

  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("issuer", data.issuer);
  formData.append("issueDate", data.issueDate);
  formData.append("credentialId", data.credentialId || "");
  formData.append("credentialUrl", data.credentialUrl || "");
  formData.append("description", data.description || "");
  formData.append("order", String(data.order ?? 0));
  formData.append("isVisible", String(Boolean(data.isVisible)));

  if (image) {
    formData.append("image", image);
  }

  const response = await api.post("/certificates", formData);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Update Certificate
|--------------------------------------------------------------------------
|
| This updates certificate metadata only.
| Image changes use the dedicated image endpoints below.
|--------------------------------------------------------------------------
*/

export const updateCertificate = async (id, data) => {
  if (!id) {
    throw new Error("Certificate ID is required.");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Certificate data is required.");
  }

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

/*
|--------------------------------------------------------------------------
| Certificate Image APIs
|--------------------------------------------------------------------------
*/

/**
 * Upload or replace the certificate image.
 */
export const uploadCertificateImage = async (id, image) => {
  if (!id) {
    throw new Error("Certificate ID is required.");
  }

  if (!(image instanceof File)) {
    throw new Error("Certificate image file is required.");
  }

  const formData = new FormData();

  formData.append("image", image);

  const response = await api.post(`/certificates/${id}/image`, formData);

  return response.data;
};

/**
 * Delete the certificate image.
 */
export const deleteCertificateImage = async (id) => {
  if (!id) {
    throw new Error("Certificate ID is required.");
  }

  const response = await api.delete(`/certificates/${id}/image`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete Certificate
|--------------------------------------------------------------------------
*/

export const deleteCertificate = async (id) => {
  if (!id) {
    throw new Error("Certificate ID is required.");
  }

  const response = await api.delete(`/certificates/${id}`);

  return response.data;
};
