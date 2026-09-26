
import api from "./axios";

/*
|--------------------------------------------------------------------------
| Get all projects
|--------------------------------------------------------------------------
*/
export const getProjects = async () => {
  const response = await api.get("/projects/admin");

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get published projects
|--------------------------------------------------------------------------
*/
export const getPublishedProjects = async () => {
  const response = await api.get("/projects", {
    params: {
      published: true,
    },
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get project by slug
|--------------------------------------------------------------------------
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

  const response = await api.post(
    `/projects/${id}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete project gallery image
|--------------------------------------------------------------------------
*/
export const deleteProjectImage = async ({
  id,
  publicId,
}) => {
  if (!id) {
    throw new Error("Project ID is required.");
  }

  if (!publicId) {
    throw new Error("Image public ID is required.");
  }

  const response = await api.delete(
    `/projects/${id}/images`,
    {
      data: {
        publicId,
      },
    },
  );

  return response.data;
};

