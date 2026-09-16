import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

const RecentProjects = ({ projects = [] }) => {
  if (projects.length === 0) {
    return (
      <div className="flex min-h-32 flex-col items-center justify-center text-center">
        <BriefcaseBusiness className="size-5 text-muted-foreground" />

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
            <p className="truncate text-sm font-medium">{project.title}</p>

            <p className="mt-1 truncate text-xs text-muted-foreground">
              {project.shortDescription || "No description"}
            </p>
          </div>

          {project.slug && (
            <Link
              to={`/projects/${project.slug}`}
              target="_blank"
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`View ${project.title}`}
            >
              <ArrowUpRight className="size-4" />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecentProjects;
