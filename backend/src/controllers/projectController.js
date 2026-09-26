import { parseInput } from "../validators/input.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/projectValidator.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import ApiError from "../utils/apiError.js";
import {
  createProject as createProjectService,
  getAllProjects as getAllProjectsService,
  getProjectBySlug as getProjectBySlugService,
  getProjectById as getProjectByIdService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
} from "../services/projectService.js";
import {
  addProjectImages as addProjectImagesService,
  removeProjectImage as removeProjectImageService,
} from "../services/projectService.js";
/**
 * Create a new project.
 */
export const createProject = async (req, res) => {
  let uploadedImage = null;

  try {
    const projectData = parseInput(createProjectSchema, req.body);
    /**
     * Upload project image to Cloudinary.
     */
    if (req.file) {
      uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "portfolio/projects"
      );
    }

    /**
     * Prepare project data.
     */

    /**
     * Add Cloudinary image information.
     */
    if (uploadedImage) {
      projectData.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    /**
     * Create project in MongoDB.
     */
    const project = await createProjectService(projectData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    /**
     * If Cloudinary upload succeeded but
     * MongoDB creation failed, delete the
     * uploaded image.
     */
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id);
      } catch {
        // Keep original error.
      }
    }

    throw error;
  }
};

/**
 * Get all projects.
 *
 * Public endpoint.
 */
export const getAllProjects = async (req, res) => {
  const publishedOnly = !req.admin;

  const projects = await getAllProjectsService({
    publishedOnly,
  });

  res.status(200).json({
    success: true,
    count: projects.length,
    projects,
  });
};

/**
 * Get project by slug.
 *
 * Public endpoint.
 */
export const getProjectBySlug = async (req, res) => {
  const project = await getProjectBySlugService(req.params.slug);
  if (!project.published) throw new ApiError(404, "Project not found");

  res.status(200).json({
    success: true,
    project,
  });
};

/**
 * Get project by ID.
 *
 * Public endpoint.
 */
export const getProjectById = async (req, res) => {
  const project = await getProjectByIdService(req.params.id);

  res.status(200).json({
    success: true,
    project,
  });
};

/**
 * Update project.
 *
 * Admin only.
 */
export const updateProject = async (req, res) => {
  let uploadedImage = null;

  try {
    /**
     * Get existing project before updating.
     *
     * We need the old image's publicId
     * so it can be removed from Cloudinary.
     */
    await getProjectByIdService(req.params.id);

    /**
     * Prepare updated project data.
     */
    const projectData = parseInput(updateProjectSchema, req.body);

    /**
     * Upload new image if provided.
     */
    if (req.file) {
      uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "portfolio/projects"
      );

      projectData.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    /**
     * Update MongoDB.
     *
     * Service returns both:
     * - updated project
     * - old image information
     */
    const { project, oldImage } = await updateProjectService(
      req.params.id,
      projectData
    );

    /**
     * Delete old Cloudinary image
     * only after MongoDB update succeeds.
     */
    if (req.file && oldImage?.publicId) {
      try {
        await deleteFromCloudinary(oldImage.publicId);
      } catch {
        // Do not fail the successful update
        // because of Cloudinary cleanup.
      }
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    /**
     * If the NEW image was uploaded but
     * the database update failed,
     * delete the new Cloudinary image.
     */
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id);
      } catch {
        // Keep original error.
      }
    }

    throw error;
  }
};

/**
 * Delete project.
 *
 * Admin only.
 */
export const deleteProject = async (req, res) => {
  const deletedProject = await deleteProjectService(req.params.id);

  /**
   * Delete main project image.
   */
  if (deletedProject.image?.publicId) {
    try {
      await deleteFromCloudinary(deletedProject.image.publicId);
    } catch {
      // MongoDB deletion already succeeded.
    }
  }

  /**
   * Delete gallery images.
   */
  if (deletedProject.images?.length) {
    for (const image of deletedProject.images) {
      if (!image.publicId) {
        continue;
      }

      try {
        await deleteFromCloudinary(image.publicId);
      } catch {
        // Continue with remaining images.
      }
    }
  }

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
};

/**
 * Add multiple gallery images.
 *
 * Admin only.
 */
export const addProjectImages = async (req, res) => {
  const uploadedImages = [];

  try {
    if (!req.files || req.files.length === 0) {
      throw new ApiError(400, "At least one image is required");
    }

    const existingProject = await getProjectByIdService(req.params.id);
    if (existingProject.images.length + req.files.length > 10) {
      throw new ApiError(400, "A project can have at most 10 gallery images");
    }

    /**
     * Upload every image to Cloudinary.
     */
    for (const file of req.files) {
      const uploaded = await uploadToCloudinary(
        file.buffer,
        "portfolio/projects/gallery"
      );

      uploadedImages.push({
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      });
    }

    /**
     * Save Cloudinary information in MongoDB.
     */
    const project = await addProjectImagesService(
      req.params.id,
      uploadedImages
    );

    res.status(200).json({
      success: true,
      message: "Project images added successfully",
      project,
    });
  } catch (error) {
    /**
     * If MongoDB fails after Cloudinary
     * uploads, clean up all uploaded images.
     */
    for (const image of uploadedImages) {
      try {
        await deleteFromCloudinary(image.publicId);
      } catch {
        // Keep original error.
      }
    }

    throw error;
  }
};

/**
 * Remove a gallery image.
 *
 * Admin only.
 */
export const removeProjectImage = async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    throw new ApiError(400, "Cloudinary publicId is required");
  }

  const { project, removedImage } = await removeProjectImageService(
    req.params.id,
    publicId
  );

  /**
   * Delete image from Cloudinary after
   * MongoDB update succeeds.
   */
  if (removedImage?.publicId) {
    try {
      await deleteFromCloudinary(removedImage.publicId);
    } catch {
      // Database update already succeeded.
    }
  }

  res.status(200).json({
    success: true,
    message: "Project image removed successfully",
    project,
  });
};
