import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

const RecentProjects = ({ projects = [] }) => {
  if (projects.length === 0) {
    return (
      <div className="flex min-h-32 flex-col items-center justify-center px-4 text-center">
        <div
          className="flex size-9 items-center justify-center rounded-lg bg-muted"
          aria-hidden="true"
        >
          <BriefcaseBusiness className="size-4 text-muted-foreground" />
        </div>

        <p className="mt-3 text-sm font-medium">No projects yet</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Add your first project to start building your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {projects.map((project) => (
        <div
          key={project._id || project.id || project.slug}
          className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {project.title || "Untitled project"}
            </p>

            <p className="mt-1 truncate text-xs text-muted-foreground">
              {project.shortDescription || "No description"}
            </p>
          </div>

          {project.slug && (
            <Link
              to={`/projects/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              aria-label={`View ${project.title || "project"}`}
            >
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecentProjects;
