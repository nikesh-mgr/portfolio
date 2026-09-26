import mongoose from "mongoose";

import Project from "../models/Project.js";
import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Validate Project ID
|--------------------------------------------------------------------------
*/

const validateProjectId = (projectId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID");
  }
};

/*
|--------------------------------------------------------------------------
| Handle Duplicate Key Error
|--------------------------------------------------------------------------
*/

const handleDuplicateKeyError = (error) => {
  if (error?.code !== 11000) {
    throw error;
  }

  const duplicateField = Object.keys(error.keyPattern || {})[0];

  if (duplicateField === "slug") {
    throw new ApiError(409, "A project with this slug already exists");
  }

  throw new ApiError(409, "A project with this value already exists");
};

/*
|--------------------------------------------------------------------------
| Create Project
|--------------------------------------------------------------------------
*/

export const createProject = async (projectData) => {
  const { title } = projectData;

  /*
   * Prevent duplicate project titles.
   */
  const existingProject = await Project.findOne({ title });

  if (existingProject) {
    throw new ApiError(409, "A project with this title already exists");
  }

  try {
    /*
     * Project model generates the slug.
     */
    const project = await Project.create(projectData);

    return project;
  } catch (error) {
    handleDuplicateKeyError(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get All Projects
|--------------------------------------------------------------------------
|
| Returns every project.
|
| Public:
| GET /api/projects
|
| Admin:
| GET /api/projects/admin/all
|
*/

export const getAllProjects = async () => {
  const projects = await Project.find({}).sort({
    featured: -1,
    order: 1,
    createdAt: -1,
  });

  return projects;
};

/*
|--------------------------------------------------------------------------
| Get Featured Projects
|--------------------------------------------------------------------------
|
| Returns only:
|
| featured === true
|
*/

export const getFeaturedProjects = async () => {
  const projects = await Project.find({
    featured: true,
  }).sort({
    order: 1,
    createdAt: -1,
  });

  return projects;
};

/*
|--------------------------------------------------------------------------
| Get Project By Slug
|--------------------------------------------------------------------------
*/

export const getProjectBySlug = async (slug) => {
  const project = await Project.findOne({
    slug,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

/*
|--------------------------------------------------------------------------
| Get Project By ID
|--------------------------------------------------------------------------
*/

export const getProjectById = async (projectId) => {
  validateProjectId(projectId);

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

/*
|--------------------------------------------------------------------------
| Update Project
|--------------------------------------------------------------------------
*/

export const updateProject = async (projectId, projectData) => {
  validateProjectId(projectId);

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  /*
   * Check duplicate title.
   */
  if (projectData.title && projectData.title !== project.title) {
    const existingProject = await Project.findOne({
      title: projectData.title,
      _id: {
        $ne: projectId,
      },
    });

    if (existingProject) {
      throw new ApiError(409, "A project with this title already exists");
    }
  }

  /*
   * Check duplicate slug if supplied.
   *
   * Normally the model generates the slug automatically.
   */
  if (projectData.slug && projectData.slug !== project.slug) {
    const existingProject = await Project.findOne({
      slug: projectData.slug,
      _id: {
        $ne: projectId,
      },
    });

    if (existingProject) {
      throw new ApiError(409, "A project with this slug already exists");
    }
  }

  /*
   * Preserve old primary image.
   */
  const oldImage = project.image
    ? {
        url: project.image.url,
        publicId: project.image.publicId,
      }
    : null;

  /*
   * Apply project updates.
   */
  Object.assign(project, projectData);

  try {
    await project.save();
  } catch (error) {
    handleDuplicateKeyError(error);
  }

  return {
    project,
    oldImage,
  };
};

/*
|--------------------------------------------------------------------------
| Delete Project
|--------------------------------------------------------------------------
*/

export const deleteProject = async (projectId) => {
  validateProjectId(projectId);

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  /*
   * Preserve primary image information.
   */
  const image = project.image
    ? {
        url: project.image.url,
        publicId: project.image.publicId,
      }
    : null;

  /*
   * Preserve gallery image information.
   */
  const images = project.images.map((item) => ({
    url: item.url,
    publicId: item.publicId,
  }));

  /*
   * Delete MongoDB document.
   */
  await project.deleteOne();

  return {
    id: project._id,
    image,
    images,
  };
};

/*
|--------------------------------------------------------------------------
| Add Project Images
|--------------------------------------------------------------------------
*/

export const addProjectImages = async (projectId, images) => {
  validateProjectId(projectId);

  if (!Array.isArray(images) || images.length === 0) {
    throw new ApiError(400, "At least one gallery image is required");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  /*
   * Maximum 10 gallery images.
   */
  if (project.images.length + images.length > 10) {
    throw new ApiError(
      400,
      "A project cannot contain more than 10 additional images"
    );
  }

  project.images.push(...images);

  try {
    await project.save();
  } catch (error) {
    handleDuplicateKeyError(error);
  }

  return project;
};

/*
|--------------------------------------------------------------------------
| Remove Project Image
|--------------------------------------------------------------------------
*/

export const removeProjectImage = async (projectId, publicId) => {
  validateProjectId(projectId);

  if (typeof publicId !== "string" || !publicId.trim()) {
    throw new ApiError(400, "Image public ID is required");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const imageIndex = project.images.findIndex(
    (image) => image.publicId === publicId
  );

  if (imageIndex === -1) {
    throw new ApiError(404, "Project gallery image not found");
  }

  /*
   * Preserve removed image for Cloudinary cleanup.
   */
  const [removedImage] = project.images.splice(imageIndex, 1);

  await project.save();

  return {
    project,
    removedImage,
  };
};
