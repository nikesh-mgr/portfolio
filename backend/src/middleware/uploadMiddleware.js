import multer from "multer";

import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 10;

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

/*
|--------------------------------------------------------------------------
| Memory Storage
|--------------------------------------------------------------------------
|
| Files are temporarily held in memory before being uploaded
| to Cloudinary.
|
*/

const storage = multer.memoryStorage();

/*
|--------------------------------------------------------------------------
| File Filter
|--------------------------------------------------------------------------
|
| This is the first layer of image validation.
|
| Actual file-signature validation will be handled during the
| upload-security phase because MIME type alone can be spoofed.
|
*/

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    callback(
      new ApiError(
        400,
        "Invalid image type. Only JPEG, PNG, and WebP images are allowed."
      ),
      false
    );

    return;
  }

  callback(null, true);
};

/*
|--------------------------------------------------------------------------
| Multer Configuration
|--------------------------------------------------------------------------
*/

const uploadMiddleware = multer({
  storage,

  limits: {
    /*
     * Maximum size of each uploaded file.
     */
    fileSize: MAX_FILE_SIZE,

    /*
     * Maximum number of files in one multipart request.
     */
    files: MAX_FILES,

    /*
     * Prevent excessive text fields.
     */
    fields: 30,

    /*
     * Prevent excessive multipart parts.
     */
    parts: 40,
  },

  fileFilter,
});

export default uploadMiddleware;
