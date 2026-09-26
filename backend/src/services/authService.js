import Admin from "../models/Admin.js";
import ApiError from "../utils/apiError.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";

/**
 * Create the initial admin account.
 */
export const createAdmin = async ({ name, email, password }) => {
  // Only one admin is allowed.
  const existingAdmin = await Admin.findOne().lean();

  if (existingAdmin) {
    throw new ApiError(409, "Admin account already exists");
  }

  const hashedPassword = await hashPassword(password);

  try {
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
    };
  } catch (error) {
    // MongoDB duplicate key error
    if (error.code === 11000) {
      throw new ApiError(409, "Admin account already exists");
    }

    throw error;
  }
};

/**
 * Authenticate an admin.
 */
export const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!admin.isActive) {
    throw new ApiError(403, "Admin account is inactive");
  }

  const passwordMatch = await comparePassword(password, admin.password);

  if (!passwordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  admin.lastLogin = new Date();

  await admin.save();

  const safeAdmin = {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
    image: admin.image,
    resume: admin.resume,
    lastLogin: admin.lastLogin,
  };

  const accessToken = generateAccessToken(safeAdmin);

  return {
    admin: safeAdmin,
    accessToken,
  };
};

/**
 * Get admin by ID.
 */
export const getAdminById = async (adminId) => {
  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  if (!admin.isActive) {
    throw new ApiError(403, "Admin account is inactive");
  }

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
    image: admin.image,
    resume: admin.resume,
    lastLogin: admin.lastLogin,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
};

/**
 * Update admin profile image.
 */
export const updateAdminProfileImage = async (adminId, image) => {
  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  if (!admin.isActive) {
    throw new ApiError(403, "Admin account is inactive");
  }

  /**
   * Save old image information so the controller
   * can remove it from Cloudinary after the
   * database update succeeds.
   */
  const oldImage = admin.image
    ? {
        url: admin.image.url,
        publicId: admin.image.publicId,
      }
    : null;

  admin.image = {
    url: image.url,
    publicId: image.publicId,
  };

  await admin.save();

  return {
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      image: admin.image,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    },
    oldImage,
  };
};
/** * Remove admin profile image. */ export const removeAdminProfileImage =
  async (adminId) => {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }
    if (!admin.isActive) {
      throw new ApiError(403, "Admin account is inactive");
    }
    if (!admin.image?.publicId) {
      throw new ApiError(404, "Admin profile image not found");
    }
    const oldImage = { url: admin.image.url, publicId: admin.image.publicId };
    admin.image = { url: null, publicId: null };
    await admin.save();
    return {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        image: admin.image,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
      oldImage,
    };
  };

/**
 * Update admin resume.
 */
export const updateAdminResume = async (adminId, resume) => {
  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  if (!admin.isActive) {
    throw new ApiError(403, "Admin account is inactive");
  }

  const oldResume = admin.resume?.publicId
    ? {
        url: admin.resume.url,
        publicId: admin.resume.publicId,
      }
    : null;

  admin.resume = {
    url: resume.url,
    publicId: resume.publicId,
    originalName: resume.originalName,
    uploadedAt: new Date(),
  };

  await admin.save();

  return {
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      image: admin.image,
      resume: admin.resume,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    },

    oldResume,
  };
};
/**
 * Remove admin resume.
 */
export const deleteAdminResume = async (adminId) => {
  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  if (!admin.resume?.publicId) {
    throw new ApiError(404, "Resume not found");
  }

  const resume = {
    publicId: admin.resume.publicId,
  };

  admin.resume = {
    url: null,
    publicId: null,
    originalName: null,
    uploadedAt: null,
  };

  await admin.save();

  return {
    resume,
  };
};
