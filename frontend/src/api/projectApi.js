import api from "./axios";

/**
 * Get all public projects.
 *
 * Backend:
 * GET /api/projects
 *
 * The backend controls the returned projects and sorting.
 * Do not add a published filter because the Project model
 * does not contain a published field.
 */
export const getProjects = async () => {
  const response = await api.get("/projects");

  return response.data;
};

/**
 * Get featured projects.
 *
 * Backend:
 * GET /api/projects/featured
 */
export const getFeaturedProjects = async () => {
  const response = await api.get("/projects/featured");

  return response.data;
};

/**
 * Get a project by slug.
 *
 * Backend:
 * GET /api/projects/slug/:slug
 */
export const getProjectBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Project slug is required.");
  }

  const response = await api.get(`/projects/slug/${slug}`);

  return response.data;
};

/**
 * Get a project by ID.
 *
 * Backend:
 * GET /api/projects/:id
 */
export const getProjectById = async (id) => {
  if (!id) {
    throw new Error("Project ID is required.");
  }

  const response = await api.get(`/projects/${id}`);

  return response.data;
};

/**
 * Get all projects for the authenticated admin.
 *
 * Backend:
 * GET /api/projects/admin/all
 */
export const getAdminProjects = async () => {
  const response = await api.get("/projects/admin/all");

  return response.data;
};

/**
 * Create a project.
 *
 * Backend:
 * POST /api/projects
 *
 * The request uses multipart/form-data.
 * Do not manually set Content-Type so Axios/browser
 * can generate the required multipart boundary.
 */
export const createProject = async (projectData) => {
  if (!(projectData instanceof FormData)) {
    throw new Error("Project data must be provided as FormData.");
  }

  const response = await api.post("/projects", projectData);

  return response.data;
};

/**
 * Update a project.
 *
 * Backend:
 * PATCH /api/projects/:id
 *
 * Image upload is optional during updates.
 */
export const updateProject = async ({ id, data }) => {
  if (!id) {
    throw new Error("Project ID is required.");
  }

  if (!(data instanceof FormData)) {
    throw new Error("Project data must be provided as FormData.");
  }

  const response = await api.patch(`/projects/${id}`, data);

  return response.data;
};

/**
 * Delete a project.
 *
 * Backend:
 * DELETE /api/projects/:id
 */
export const deleteProject = async (id) => {
  if (!id) {
    throw new Error("Project ID is required.");
  }

  const response = await api.delete(`/projects/${id}`);

  return response.data;
};

/**
 * Upload project gallery images.
 *
 * Backend field name:
 * images
 *
 * Maximum gallery size is controlled by the backend.
 */
export const uploadProjectImages = async ({ id, files }) => {
  if (!id) {
    throw new Error("Project ID is required.");
  }

  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("At least one image is required.");
  }

  const validFiles = files.filter((file) => file instanceof File);

  if (validFiles.length !== files.length) {
    throw new Error("One or more selected images are invalid.");
  }

  const formData = new FormData();

  validFiles.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post(`/projects/${id}/images`, formData);

  return response.data;
};

/**
 * Delete a project gallery image.
 *
 * The backend requires the Cloudinary publicId.
 * Never reconstruct or modify the publicId on the frontend.
 */
export const deleteProjectImage = async ({ id, publicId }) => {
  if (!id) {
    throw new Error("Project ID is required.");
  }

  if (!publicId) {
    throw new Error("Image publicId is required.");
  }

  const response = await api.delete(`/projects/${id}/images`, {
    data: {
      publicId,
    },
  });

  return response.data;
};
