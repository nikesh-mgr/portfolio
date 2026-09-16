import { FolderKanban } from "lucide-react";
import { motion } from "framer-motion";

import ProjectCard from "./ProjectCard";

const ProjectsGrid = ({ projects, isLoading, isError }) => {
  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <ProjectSkeleton key={item} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8">
        <FolderKanban className="size-8 text-muted-foreground" />

        <h2 className="mt-4 font-semibold">Projects couldn't be loaded</h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          There was a problem loading the projects. Please try again later.
        </p>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <FolderKanban className="mx-auto size-8 text-muted-foreground" />

        <h2 className="mt-4 font-semibold">No projects available</h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Projects will appear here once they are published.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <motion.div
          key={project._id || project.id || project.slug}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: Math.min(index * 0.06, 0.3),
          }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
};

const ProjectSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="aspect-[16/10] animate-pulse bg-muted" />

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>

        <div className="mt-5 flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
          <div className="h-6 w-20 animate-pulse rounded bg-muted" />
          <div className="h-6 w-14 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
};

export default ProjectsGrid;
