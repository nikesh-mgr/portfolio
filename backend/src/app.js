import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import env from "./config/env.js";

import requestIdMiddleware from "./middleware/requestIdMiddleware.js";

import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { globalRateLimiter } from "./middleware/rateLimiter.js";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import siteSettingsRoutes from "./routes/siteSettingsRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

/*
 * ---------------------------------------------------------
 * TRUST PROXY
 * ---------------------------------------------------------
 * Required when the production application runs behind a
 * trusted reverse proxy.
 *
 * This allows Express to determine the original client IP,
 * which is important for logging and rate limiting.
 */
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

/*
 * ---------------------------------------------------------
 * REQUEST ID
 * ---------------------------------------------------------
 * Creates/normalizes a request ID before other application
 * middleware and routes run.
 *
 * This makes requests easier to trace in logs and API errors.
 */
app.use(requestIdMiddleware);

/*
 * ---------------------------------------------------------
 * SECURITY HEADERS
 * ---------------------------------------------------------
 * Helmet adds commonly recommended HTTP security headers.
 */
app.use(helmet());

/*
 * ---------------------------------------------------------
 * CORS
 * ---------------------------------------------------------
 * The frontend origin is explicitly configured instead of
 * allowing arbitrary origins.
 *
 * credentials: true is required because authentication uses
 * an HTTP-only accessToken cookie.
 */
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Request-ID"],
  })
);

/*
 * ---------------------------------------------------------
 * GLOBAL RATE LIMITER
 * ---------------------------------------------------------
 * Provides baseline request protection for the complete API.
 *
 * More restrictive route-specific limiters may still exist
 * for sensitive endpoints such as authentication or contact.
 */
app.use(globalRateLimiter);

/*
 * ---------------------------------------------------------
 * REQUEST BODY PARSERS
 * ---------------------------------------------------------
 * Keep request body limits reasonably small.
 *
 * File uploads are handled separately by Multer on the
 * appropriate routes.
 */
app.use(express.json({ limit: "100kb" }));

app.use(
  express.urlencoded({
    extended: false,
    limit: "100kb",
  })
);

/*
 * ---------------------------------------------------------
 * COOKIE PARSER
 * ---------------------------------------------------------
 * Required by authMiddleware to read the HTTP-only
 * accessToken cookie.
 */
app.use(cookieParser());

/*
 * ---------------------------------------------------------
 * API ROUTES
 * ---------------------------------------------------------
 */

app.use("/api/health", healthRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/certificates", certificateRoutes);

app.use("/api/experiences", experienceRoutes);

app.use("/api/skills", skillRoutes);

app.use("/api/site-settings", siteSettingsRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/resume", resumeRoutes);

/*
 * ---------------------------------------------------------
 * NOT FOUND
 * ---------------------------------------------------------
 * This must be registered after all valid API routes.
 */
app.use(notFoundMiddleware);

/*
 * ---------------------------------------------------------
 * GLOBAL ERROR HANDLER
 * ---------------------------------------------------------
 * This must be the final middleware so errors from routes
 * and previous middleware are handled centrally.
 */
app.use(errorMiddleware);

export default app;
