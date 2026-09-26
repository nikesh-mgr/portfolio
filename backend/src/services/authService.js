import mongoose from "mongoose";

import Admin from "../models/Admin.js";
import ApiError from "../utils/ApiError.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";

/*
|--------------------------------------------------------------------------
| Safe admin response
|--------------------------------------------------------------------------
|
| Never expose the password or other authentication internals to
| controllers/routes.
|
| Convert MongoDB ObjectId to a string so the API response has a
| predictable type for the frontend.
|
*/

const getSafeAdmin = (admin) => ({
  id: admin._id.toString(),
  name: admin.name,
  email: admin.email,
  role: admin.role,
  isActive: admin.isActive,
  image: admin.image,
  resume: admin.resume,
  lastLogin: admin.lastLogin,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

/*
|--------------------------------------------------------------------------
| Create initial admin
|--------------------------------------------------------------------------
|
| The application allows only one admin account.
|
| IMPORTANT:
| The Admin model enforces this at the database level with a unique
| index on `role`. The initial findOne() check is still useful for the
| normal case, but it is NOT treated as the security boundary.
|
| If two requests arrive simultaneously:
|
| Request A → sees no admin
| Request B → sees no admin
| Request A → creates admin
| Request B → MongoDB rejects duplicate role
|
| The duplicate-key handler below converts that database constraint
| into a clean API response.
|
*/

export const createAdmin = async ({ name, email, password }) => {
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

    return getSafeAdmin(admin);
  } catch (error) {
    /*
     * Duplicate-key errors can occur when concurrent requests attempt
     * to create the initial admin.
     *
     * This is expected protection, not an unexpected server failure.
     */
    if (error?.code === 11000) {
      throw new ApiError(409, "Admin account already exists");
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Authenticate admin
|--------------------------------------------------------------------------
|
| The password field is excluded by the Admin schema by default.
| Explicitly select it only for password verification.
|
*/

export const loginAdmin = async ({ email, password }) => {
  /*
   * The validator already normalizes email, but normalize again here
   * so the service remains safe if it is called from another internal
   * location in the future.
   */
  const normalizedEmail = email.trim().toLowerCase();

  const admin = await Admin.findOne({
    email: normalizedEmail,
  }).select("+password");

  /*
   * Use the same response for:
   * - account not found
   * - inactive account
   * - incorrect password
   *
   * This avoids exposing account-state information through the API.
   */
  if (!admin || !admin.isActive) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatch = await comparePassword(password, admin.password);

  if (!passwordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  /*
   * Record the successful login time only after the password has
   * been verified.
   */
  admin.lastLogin = new Date();

  await admin.save();

  const safeAdmin = getSafeAdmin(admin);

  /*
   * The JWT contains only the admin ID and role.
   * The token itself is returned to the controller and placed into
   * the HTTP-only cookie there.
   */
  const accessToken = generateAccessToken({
    id: admin._id,
    role: admin.role,
  });

  return {
    admin: safeAdmin,
    accessToken,
  };
};

/*
|--------------------------------------------------------------------------
| Get admin by ID
|--------------------------------------------------------------------------
|
| Used by the /me controller after authentication.
|
*/

export const getAdminById = async (adminId) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    throw new ApiError(400, "Invalid admin ID");
  }

  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  if (!admin.isActive) {
    throw new ApiError(403, "Admin account is inactive");
  }

  return getSafeAdmin(admin);
};

/*
|--------------------------------------------------------------------------
| Get authenticated admin
|--------------------------------------------------------------------------
|
| This is intentionally separate from getAdminById().
|
| Authentication failures use 401 when the account cannot be
| authenticated, while an existing but inactive admin receives 403.
|
| The complete Mongoose document is returned internally because
| profile image/resume services need to modify the document.
|
*/

export const getAuthenticatedAdmin = async (adminId) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    throw new ApiError(401, "Invalid authentication token");
  }

  const admin = await Admin.findById(adminId);

  if (!admin) {
    throw new ApiError(401, "Authentication required");
  }

  if (!admin.isActive) {
    throw new ApiError(403, "Admin account is inactive");
  }

  return admin;
};

/*
|--------------------------------------------------------------------------
| Update admin profile image
|--------------------------------------------------------------------------
|
| Cloudinary upload happens in the controller.
| This service only updates the trusted URL/publicId supplied by the
| controller and returns the previous asset so the controller can
| remove it from Cloudinary after the database update succeeds.
|
*/

export const updateAdminProfileImage = async (adminId, image) => {
  const admin = await getAuthenticatedAdmin(adminId);

  const oldImage = admin.image?.publicId
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
    admin: getSafeAdmin(admin),
    oldImage,
  };
};

/*
|--------------------------------------------------------------------------
| Remove admin profile image
|--------------------------------------------------------------------------
*/

export const removeAdminProfileImage = async (adminId) => {
  const admin = await getAuthenticatedAdmin(adminId);

  if (!admin.image?.publicId) {
    throw new ApiError(404, "Admin profile image not found");
  }

  const oldImage = {
    url: admin.image.url,
    publicId: admin.image.publicId,
  };

  admin.image = {
    url: null,
    publicId: null,
  };

  await admin.save();

  return {
    admin: getSafeAdmin(admin),
    oldImage,
  };
};

/*
|--------------------------------------------------------------------------
| Update admin resume
|--------------------------------------------------------------------------
|
| The controller handles the Cloudinary upload and provides only the
| resulting URL/publicId and sanitized filename to this service.
|
*/

export const updateAdminResume = async (adminId, resume) => {
  const admin = await getAuthenticatedAdmin(adminId);

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
    admin: getSafeAdmin(admin),
    oldResume,
  };
};

/*
|--------------------------------------------------------------------------
| Delete admin resume
|--------------------------------------------------------------------------
|
| MongoDB is updated first. The controller then removes the associated
| Cloudinary raw resource.
|
*/

export const deleteAdminResume = async (adminId) => {
  const admin = await getAuthenticatedAdmin(adminId);

  if (!admin.resume?.publicId) {
    throw new ApiError(404, "Resume not found");
  }

  const resume = {
    url: admin.resume.url,
    publicId: admin.resume.publicId,
    originalName: admin.resume.originalName,
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
