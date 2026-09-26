import { v2 as cloudinary } from "cloudinary";

import env from "./env.js";

/*
|--------------------------------------------------------------------------
| Cloudinary Configuration
|--------------------------------------------------------------------------
 *
 * Credentials come exclusively from environment variables.
 *
 * Never expose CLOUDINARY_API_SECRET to the frontend.
 */

cloudinary.config({
  cloud_name: env.CLOUDINARY.CLOUD_NAME,
  api_key: env.CLOUDINARY.API_KEY,
  api_secret: env.CLOUDINARY.API_SECRET,
});

export default cloudinary;
