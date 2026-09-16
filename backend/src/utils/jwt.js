import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateAccessToken = (admin) => {
  return jwt.sign(
    {
      sub: admin.id.toString(),
      role: admin.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
