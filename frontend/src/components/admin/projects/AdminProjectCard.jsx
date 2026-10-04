import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import ProjectStatusBadge from "./ProjectStatusBadge";

const AdminProjectCard = ({ project, onDelete, isDeleting = false }) => {
  const projectId = project?._id || project?.id;
  const projectSlug = project?.slug;

  const imageUrl =
    typeof project?.image === "string"
      ? project.image
      : project?.image?.url || null;

  const title = project?.title || "Untitled project";

  return (
    <article className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-sm">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} project preview`}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}

        {project?.featured && (
          <div className="absolute right-3 top-3">
            <span className="rounded-full border bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ProjectStatusBadge status={project?.status} />

            {project?.category && (
              <span className="text-xs text-muted-foreground">
                {project.category}
              </span>
            )}
          </div>

          <h2 className="line-clamp-1 text-lg font-semibold tracking-tight">
            {title}
          </h2>

          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {project?.shortDescription || "No description available."}
          </p>
        </div>

        {/* Technologies */}
        {Array.isArray(project?.technologies) &&
          project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((technology) => (
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

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t pt-4">
          {projectId && (
            <Link
              to={`/admin/projects/${projectId}/edit`}
              aria-label={`Edit ${title}`}
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Pencil className="size-4" aria-hidden="true" />
            </Link>
          )}

          {project?.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open GitHub for ${title}`}
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FaGithub className="size-4" aria-hidden="true" />
            </a>
          )}

          {project?.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open live project for ${title}`}
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          )}

          {projectSlug && (
            <Link
              to={`/projects/${projectSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View public ${title}`}
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Eye className="size-4" aria-hidden="true" />
            </Link>
          )}

          {projectId && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onDelete(project)}
              disabled={isDeleting}
              aria-label={`Delete ${title}`}
            >
              {isDeleting ? (
                <span
                  className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
              ) : (
                <Trash2 className="size-4" aria-hidden="true" />
              )}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default AdminProjectCard;
