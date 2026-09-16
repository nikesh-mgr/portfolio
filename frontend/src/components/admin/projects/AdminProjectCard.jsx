
import {
  ExternalLink,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import ProjectStatusBadge from "./ProjectStatusBadge";

const AdminProjectCard = ({
  project,
  onDelete,
  isDeleting = false,
}) => {
  /*
   * MongoDB ID
   *
   * Used ONLY for admin operations such as edit/delete.
   */
  const projectId = project?._id || project?.id;

  /*
   * Slug
   *
   * Used for the public project page.
   */
  const projectSlug = project?.slug;

  /*
   * Project image
   */
  const imageUrl =
    typeof project?.image === "string"
      ? project.image
      : project?.image?.url || null;

  return (
    <article className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-sm">
      {/* -------------------------------------------------------------- */}
      {/* Image */}
      {/* -------------------------------------------------------------- */}

      <div className="relative aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project?.title || "Project image"}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="text-sm text-muted-foreground">
              No image
            </span>
          </div>
        )}

        {/* Visibility */}
        <div className="absolute left-3 top-3">
          {project?.published ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
              <Eye className="size-3.5" />
              Published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <EyeOff className="size-3.5" />
              Draft
            </span>
          )}
        </div>

        {/* Featured */}
        {project?.featured && (
          <div className="absolute right-3 top-3">
            <span className="rounded-full border bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Content */}
      {/* -------------------------------------------------------------- */}

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          {/* Status + Category */}
          <div className="flex flex-wrap items-center gap-2">
            <ProjectStatusBadge
              status={project?.status}
            />

            {project?.category && (
              <span className="text-xs text-muted-foreground">
                {project.category}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">
            {project?.title || "Untitled project"}
          </h3>

          {/* Description */}
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {project?.shortDescription || "No description available."}
          </p>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Technologies */}
        {/* ------------------------------------------------------------ */}

        {Array.isArray(project?.technologies) &&
          project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies
                .slice(0, 4)
                .map((technology) => (
                  <span
                    key={technology}
                    className="rounded-md border bg-muted/40 px-2 py-1 text-xs text-muted-foreground"
                  >
                    {technology}
                  </span>
                ))}

              {project.technologies.length > 4 && (
                <span className="rounded-md border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          )}

        {/* ------------------------------------------------------------ */}
        {/* Actions */}
        {/* ------------------------------------------------------------ */}

        <div className="flex items-center justify-between gap-2 border-t pt-4">
          <div />

          <div className="flex items-center gap-2">
            {/* -------------------------------------------------------- */}
            {/* Edit */}
            {/* -------------------------------------------------------- */}

            {projectId && (
              <Link
                to={`/admin/projects/${projectId}/edit`}
                aria-label={`Edit ${project?.title || "project"}`}
                className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Pencil className="size-4" />
              </Link>
            )}

            {/* -------------------------------------------------------- */}
            {/* GitHub */}
            {/* -------------------------------------------------------- */}

            {project?.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open GitHub for ${
                  project?.title || "project"
                }`}
                className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <FaGithub className="size-4" />
              </a>
            )}

            {/* -------------------------------------------------------- */}
            {/* Live project */}
            {/* -------------------------------------------------------- */}

            {project?.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open live project ${
                  project?.title || "project"
                }`}
                className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ExternalLink className="size-4" />
              </a>
            )}

            {/* -------------------------------------------------------- */}
            {/* Public project */}
            {/* -------------------------------------------------------- */}

            {projectSlug && (
              <Link
                to={`/projects/${projectSlug}`}
                target="_blank"
                aria-label={`View ${project?.title || "project"}`}
                className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Eye className="size-4" />
              </Link>
            )}

            {/* -------------------------------------------------------- */}
            {/* Delete */}
            {/* -------------------------------------------------------- */}

            {projectId && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onDelete(project)}
                disabled={isDeleting}
                aria-label={`Delete ${
                  project?.title || "project"
                }`}
              >
                {isDeleting ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default AdminProjectCard;
