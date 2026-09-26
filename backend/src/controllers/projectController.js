import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";

import ApiError from "../utils/ApiError.js";

import {
  createProject as createProjectService,
  getAllProjects as getAllProjectsService,
  getFeaturedProjects as getFeaturedProjectsService,
  getProjectBySlug as getProjectBySlugService,
  getProjectById as getProjectByIdService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
  addProjectImages as addProjectImagesService,
  removeProjectImage as removeProjectImageService,
} from "../services/projectService.js";

/*
|--------------------------------------------------------------------------
| Create Project
|--------------------------------------------------------------------------
|
| Admin only.
|
*/

export const createProject = async (req, res) => {
  let uploadedImage = null;

  try {
    /*
     * Upload primary image first.
     */
    if (req.file) {
      uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "portfolio/projects"
      );
    }

    /*
     * Prepare project data.
     */
    const projectData = {
      ...req.body,
    };

    /*
     * Store Cloudinary references only.
     */
    if (uploadedImage) {
      projectData.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    /*
     * Create project.
     */
    const project = await createProjectService(projectData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    /*
     * Remove uploaded Cloudinary image
     * if MongoDB creation fails.
     */
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id);
      } catch {
        // Preserve original error.
      }
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Get All Projects
|--------------------------------------------------------------------------
|
| Public endpoint.
|
| GET /api/projects
|
| Returns every project.
|
*/

export const getAllProjects = async (req, res) => {
  const projects = await getAllProjectsService();

  res.status(200).json({
    success: true,
    count: projects.length,
    projects,
  });
};

/*
|--------------------------------------------------------------------------
| Get Featured Projects
|--------------------------------------------------------------------------
|
| Public endpoint.
|
| GET /api/projects/featured
|
| Returns only projects where:
|
| featured === true
|
*/

export const getFeaturedProjects = async (req, res) => {
  const projects = await getFeaturedProjectsService();

  res.status(200).json({
    success: true,
    count: projects.length,
    projects,
  });
};

/*
|--------------------------------------------------------------------------
| Get All Admin Projects
|--------------------------------------------------------------------------
|
| Admin only.
|
| GET /api/projects/admin/all
|
| Returns every project.
|
| This endpoint is kept separate from the public endpoint
| so the admin API has a clear dedicated route.
|
*/

export const getAllAdminProjects = async (req, res) => {
  const projects = await getAllProjectsService();

  res.status(200).json({
    success: true,
    count: projects.length,
    projects,
  });
};

/*
|--------------------------------------------------------------------------
| Get Project By Slug
|--------------------------------------------------------------------------
|
| Public endpoint.
|
*/

export const getProjectBySlug = async (req, res) => {
  const project = await getProjectBySlugService(req.params.slug);

  res.status(200).json({
    success: true,
    project,
  });
};

/*
|--------------------------------------------------------------------------
| Get Project By ID
|--------------------------------------------------------------------------
|
| Public endpoint.
|
*/

export const getProjectById = async (req, res) => {
  const project = await getProjectByIdService(req.params.id);

  res.status(200).json({
    success: true,
    project,
  });
};

/*
|--------------------------------------------------------------------------
| Update Project
|--------------------------------------------------------------------------
|
| Admin only.
|
*/

export const updateProject = async (req, res) => {
  let uploadedImage = null;

  try {
    /*
     * Retrieve existing project.
     */
    const existingProject = await getProjectByIdService(req.params.id);

    /*
     * Prepare update data.
     */
    const projectData = {
      ...req.body,
    };

    /*
     * Upload replacement image if provided.
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

    /*
     * Update project.
     */
    const { project, oldImage } = await updateProjectService(
      existingProject._id.toString(),
      projectData
    );

    /*
     * Remove old Cloudinary image after
     * successful database update.
     */
    if (req.file && oldImage?.publicId) {
      try {
        await deleteFromCloudinary(oldImage.publicId);
      } catch {
        // Database update already succeeded.
      }
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    /*
     * Remove newly uploaded image if update failed.
     */
    if (uploadedImage?.public_id) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id);
      } catch {
        // Preserve original error.
      }
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Delete Project
|--------------------------------------------------------------------------
|
| Admin only.
|
*/

export const deleteProject = async (req, res) => {
  const deletedProject = await deleteProjectService(req.params.id);

  /*
   * Delete primary image.
   */
  if (deletedProject.image?.publicId) {
    try {
      await deleteFromCloudinary(deletedProject.image.publicId);
    } catch {
      // Database deletion already succeeded.
    }
  }

  /*
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
        // Continue cleaning remaining images.
      }
    }
  }

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
};

/*
|--------------------------------------------------------------------------
| Add Project Images
|--------------------------------------------------------------------------
|
| Admin only.
|
*/

export const addProjectImages = async (req, res) => {
  const uploadedImages = [];

  try {
    if (!req.files || req.files.length === 0) {
      throw new ApiError(400, "At least one image is required");
    }

    /*
     * Upload gallery images.
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

    /*
     * Save image references.
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
    /*
     * Cleanup Cloudinary uploads if MongoDB fails.
     */
    for (const image of uploadedImages) {
      if (!image.publicId) {
        continue;
      }

      try {
        await deleteFromCloudinary(image.publicId);
      } catch {
        // Preserve original error.
      }
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Remove Project Image
|--------------------------------------------------------------------------
|
| Admin only.
|
*/

export const removeProjectImage = async (req, res) => {
  const { publicId } = req.body;

  if (typeof publicId !== "string" || !publicId.trim()) {
    throw new ApiError(400, "Cloudinary publicId is required");
  }

  const { project, removedImage } = await removeProjectImageService(
    req.params.id,
    publicId.trim()
  );

  /*
   * Delete Cloudinary image after
   * successful MongoDB update.
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
