import api from "./axios";

/*
|--------------------------------------------------------------------------
| Get all projects
|--------------------------------------------------------------------------
|
| Returns all projects.
|
| Used by:
| - Public Projects page
| - Admin project management
|
| GET /api/projects
|
*/
export const getProjects = async () => {
  const response = await api.get("/projects");

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get featured projects
|--------------------------------------------------------------------------
|
| Returns only projects where featured = true.
|
| Used by:
| - Home page featured projects section
|
| GET /api/projects/featured
|
*/
export const getFeaturedProjects = async () => {
  const response = await api.get("/projects/featured");

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get project by slug
|--------------------------------------------------------------------------
|
| Returns a project by its slug.
|
| GET /api/projects/slug/:slug
|
*/
export const getProjectBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Project slug is required.");
  }

  const response = await api.get(`/projects/slug/${slug}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get project by ID
|--------------------------------------------------------------------------
|
| Returns a project by its MongoDB ID.
|
| GET /api/projects/:id
|
*/
export const getProjectById = async (id) => {
  if (!id) {
    throw new Error("Project ID is required.");
  }

  const response = await api.get(`/projects/${id}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Create project
|--------------------------------------------------------------------------
|
| Admin only.
|
| `projectData` should be FormData when an image is
| being uploaded.
|
*/
export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Update project
|--------------------------------------------------------------------------
|
| Admin only.
|
| `data` should be FormData.
|
*/
export const updateProject = async ({ id, data }) => {
  if (!id) {
    throw new Error("Project ID is required.");
  }

  const response = await api.patch(`/projects/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete project
|--------------------------------------------------------------------------
|
| Admin only.
|
*/
export const deleteProject = async (id) => {
  if (!id) {
    throw new Error("Project ID is required.");
  }

  const response = await api.delete(`/projects/${id}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Upload project gallery images
|--------------------------------------------------------------------------
|
| Backend field name:
| images
|
| Admin only.
|
*/
export const uploadProjectImages = async ({ id, files }) => {
  if (!id) {
    throw new Error("Project ID is required.");
  }

  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("At least one image is required.");
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post(`/projects/${id}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete project gallery image
|--------------------------------------------------------------------------
|
| The backend requires the Cloudinary publicId,
| not the image URL.
|
| Admin only.
|
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
