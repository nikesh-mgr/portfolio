import mongoose from "mongoose";
import Project from "../models/Project.js";
import ApiError from "../utils/apiError.js";

/**
 * Create a new project.
 */
export const createProject = async (projectData) => {
  const { title, slug } = projectData;

  const existingProject = await Project.findOne({
    $or: [{ title }, { slug }],
  });

  if (existingProject) {
    if (existingProject.title === title) {
      throw new ApiError(409, "A project with this title already exists");
    }

    if (existingProject.slug === slug) {
      throw new ApiError(409, "A project with this slug already exists");
    }
  }

  const project = await Project.create(projectData);

  return project;
};

/**
 * Get all projects.
 */
export const getAllProjects = async ({ publishedOnly = false } = {}) => {
  const filter = publishedOnly ? { published: true } : {};

  const projects = await Project.find(filter).sort({
    featured: -1,
    order: 1,
    createdAt: -1,
  });

  return projects;
};

/**
 * Get a project by slug.
 */
export const getProjectBySlug = async (slug) => {
  const project = await Project.findOne({ slug });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

/**
 * Get a project by ID.
 */
export const getProjectById = async (projectId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

/**
 * Update a project.
 */
export const updateProject = async (projectId, projectData) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  /**
   * Check duplicate title.
   */
  if (projectData.title && projectData.title !== project.title) {
    const existingProject = await Project.findOne({
      title: projectData.title,
      _id: { $ne: projectId },
    });

    if (existingProject) {
      throw new ApiError(409, "A project with this title already exists");
    }
  }

  /**
   * Check duplicate slug.
   *
   * Normally the Project model generates the slug
   * automatically from the title.
   */
  if (projectData.slug && projectData.slug !== project.slug) {
    const existingProject = await Project.findOne({
      slug: projectData.slug,
      _id: { $ne: projectId },
    });

    if (existingProject) {
      throw new ApiError(409, "A project with this slug already exists");
    }
  }

  /**
   * Keep the old image so the controller can
   * delete it from Cloudinary after the update.
   */
  const oldImage = project.image
    ? {
        url: project.image.url,
        publicId: project.image.publicId,
      }
    : null;

  /**
   * Update project fields.
   */
  Object.assign(project, projectData);

  await project.save();

  return {
    project,
    oldImage,
  };
};

/**
 * Delete a project.
 */
export const deleteProject = async (projectId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  /**
   * Keep Cloudinary information before
   * deleting the MongoDB document.
   */
  const image = project.image
    ? {
        url: project.image.url,
        publicId: project.image.publicId,
      }
    : null;

  const images = project.images.map((item) => ({
    url: item.url,
    publicId: item.publicId,
  }));

  await project.deleteOne();

  return {
    id: project._id,
    image,
    images,
  };
};

/**
 * Add gallery images to a project.
 */
export const addProjectImages = async (projectId, images) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  project.images.push(...images);

  await project.save();

  return project;
};

/**
 * Remove a gallery image from a project.
 */
export const removeProjectImage = async (projectId, publicId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID");
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

  const [removedImage] = project.images.splice(imageIndex, 1);

  await project.save();

  return {
    project,
    removedImage,
  };
};
