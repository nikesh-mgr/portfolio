import multer from "multer";

import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const allowedMimeTypes = new Set(["application/pdf"]);

/*
|--------------------------------------------------------------------------
| Memory Storage
|--------------------------------------------------------------------------
|
| The file is temporarily stored in memory before being uploaded
| to Cloudinary.
|
| The strict file/field/part limits below reduce memory-abuse risk.
|
*/

const storage = multer.memoryStorage();

/*
|--------------------------------------------------------------------------
| File Filter
|--------------------------------------------------------------------------
|
| This is the first layer of file validation.
|
| A deeper PDF signature check will be performed before accepting
| the file as a valid resume.
|
*/

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    callback(
      new ApiError(400, "Invalid resume file. Only PDF files are allowed."),
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

const resumeUploadMiddleware = multer({
  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,

    /*
     * Only one resume should be uploaded per request.
     */
    files: 1,

    /*
     * Prevent excessive non-file form fields.
     */
    fields: 10,

    /*
     * Prevent multipart request abuse.
     */
    parts: 12,
  },

  fileFilter,
});

export default resumeUploadMiddleware;
