import multer from "multer";
import ApiError from "../utils/apiError.js";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new ApiError(
      400,
      "Only JPEG, PNG, WebP, and AVIF images are allowed"
    );

    error.statusCode = 400;

    callback(error, false);
    return;
  }

  callback(null, true);
};

const uploadMiddleware = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
    fields: 100,
    fieldSize: 1024 * 1024,
    parts: 110,
    files: 10,
  },

  fileFilter,
});

export default uploadMiddleware;
