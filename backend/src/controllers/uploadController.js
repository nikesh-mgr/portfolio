import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const uploadProjectImage = async (req, res) => {
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
