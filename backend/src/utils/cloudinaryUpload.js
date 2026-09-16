import cloudinary from "../config/cloudinary.js";

/**
 * Upload a file buffer to Cloudinary.
 *
 * @param {Buffer} fileBuffer
 * @param {string} folder
 * @param {string} resourceType
 * @param {string} format
 * @returns {Promise<object>}
 */
export const uploadToCloudinary = async (
  fileBuffer,
  folder,
  resourceType = "image",
  format = undefined
) => {
  if (!fileBuffer) {
    throw new Error("File buffer is required");
  }

  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: resourceType,
    };

    if (format) {
      options.format = format;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Upload a PDF file to Cloudinary.
 */
export const uploadPdfToCloudinary = async (fileBuffer, folder) => {
  if (!fileBuffer) {
    throw new Error("File buffer is required");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        format: "pdf",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete a file from Cloudinary.
 */
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
