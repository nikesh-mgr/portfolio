import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import ProjectStatusBadge from "./ProjectStatusBadge";

const AdminProjectTable = ({
  projects,
  onDelete,
  deletingProjectId = null,
}) => {
  return (
    <div className="hidden overflow-hidden rounded-xl border bg-card lg:block">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Portfolio projects</caption>

          <thead className="border-b bg-muted/30">
            <tr>
              <th className="px-5 py-4 text-left font-medium">Project</th>

              <th className="px-5 py-4 text-left font-medium">Category</th>

              <th className="px-5 py-4 text-left font-medium">Status</th>

              <th className="px-5 py-4 text-left font-medium">Featured</th>

              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {projects.map((project) => {
              const projectId = project?._id || project?.id;
              const title = project?.title || "Untitled project";

              const imageUrl =
                typeof project?.image === "string"
                  ? project.image
                  : project?.image?.url || null;

              const isDeleting = deletingProjectId === projectId;

              return (
                <tr
                  key={projectId}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-5 py-4">
                    <div className="flex min-w-[280px] items-center gap-3">
                      <div className="size-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`${title} project preview`}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <span className="text-[10px] text-muted-foreground">
                              No image
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium">{title}</p>

                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          {project?.shortDescription || "No description"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-muted-foreground">
                      {project?.category || "—"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <ProjectStatusBadge status={project?.status} />
                  </td>

                  <td className="px-5 py-4">
                    {project?.featured ? (
                      <span className="text-xs font-medium">Featured</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Standard
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/projects/${projectId}/edit`}
                        aria-label={`Edit ${title}`}
                        className="inline-flex size-9 items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Link>

                      {project?.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open GitHub for ${title}`}
                          className="inline-flex size-9 items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                          className="inline-flex size-9 items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <ExternalLink className="size-4" aria-hidden="true" />
                        </a>
                      )}

                      {project?.slug && (
                        <Link
                          to={`/projects/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View public ${title}`}
                          className="inline-flex size-9 items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Eye className="size-4" aria-hidden="true" />
                        </Link>
                      )}

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
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProjectTable;
