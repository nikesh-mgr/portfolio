import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error("Only JPEG, PNG, and WebP images are allowed");

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
    files: 10,
  },

  fileFilter,
});

export default uploadMiddleware;
