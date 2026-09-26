import multer from "multer";
import ApiError from "../utils/apiError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
    return;
  }

  cb(new ApiError(400, "Only PDF files are allowed"), false);
};

const resumeUploadMiddleware = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
    fields: 100,
    fieldSize: 1024 * 1024,
    parts: 110,
  },
});

export default resumeUploadMiddleware;
