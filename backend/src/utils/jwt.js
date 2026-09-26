import jwt from "jsonwebtoken";

import env from "../config/env.js";

/*
|--------------------------------------------------------------------------
| JWT configuration
|--------------------------------------------------------------------------
|
| Issuer and audience bind the token to this portfolio backend.
| This provides an additional protection layer if the same JWT secret
| is ever accidentally reused by another service.
|
| Keep these values stable after deployment because changing them
| invalidates existing tokens.
|
*/

const JWT_ISSUER = "developer-portfolio-backend";
const JWT_AUDIENCE = "developer-portfolio-admin";

/*
|--------------------------------------------------------------------------
| Generate Access Token
|--------------------------------------------------------------------------
|
| The payload intentionally contains only the minimum information
| required by authentication middleware.
|
| sub  → Admin MongoDB ID
| role → Admin role
|
| Never place passwords, email addresses, Cloudinary credentials,
| or other sensitive information inside the JWT.
|
*/

export const generateAccessToken = (admin) => {
  return jwt.sign(
    {
      sub: admin.id.toString(),
      role: admin.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );
};

/*
|--------------------------------------------------------------------------
| Verify Access Token
|--------------------------------------------------------------------------
|
| jwt.verify() checks:
|
| - Signature
| - Expiration
| - Issuer
| - Audience
| - Token structure
|
| Authentication middleware is responsible for converting JWT errors
| into the appropriate API response.
|
*/

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
};
