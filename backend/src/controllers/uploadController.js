import ApiError from "../utils/apiError.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const uploadProjectImage = async (req, res) => {
  if (!req.file) throw new ApiError(400, "Image file is required");
  const result = await uploadToCloudinary(
    req.file.buffer,
    "portfolio/projects"
  );

  res.status(201).json({
    success: true,
    message: "Project image uploaded successfully",

    image: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    },
  });
};
