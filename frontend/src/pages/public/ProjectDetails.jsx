
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FolderKanban } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";

import { getProjectBySlug } from "@/api/projectApi";
import ProjectDetailsContent from "@/components/projects/ProjectDetailsContent";

const ProjectDetails = () => {
  const { slug } = useParams();

  const projectQuery = useQuery({
    queryKey: ["project", "slug", slug],
    queryFn: () => getProjectBySlug(slug),
    enabled: Boolean(slug),
  });

  const {
    data,
    isLoading,
    isError,
    error,
  } = projectQuery;

  const project = data?.project || data?.data || data || null;

  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  if (isError || !project || project.published !== true) {
    console.error("Failed to load project:", error);

    return <ProjectNotFound />;
  }

  return <ProjectDetailsContent project={project} />;
};

/* -------------------------------------------------------------------------- */
/* Loading skeleton                                                           */
/* -------------------------------------------------------------------------- */

const ProjectDetailsSkeleton = () => {
  return (
    <div>
      <section className="border-b py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />

          <div className="mt-10 space-y-4">
            <div className="h-5 w-28 animate-pulse rounded-full bg-muted" />

            <div className="h-12 w-full max-w-3xl animate-pulse rounded bg-muted sm:h-16" />

            <div className="h-6 w-full max-w-2xl animate-pulse rounded bg-muted" />
          </div>

          <div className="mt-8 flex gap-3">
            <div className="h-11 w-28 animate-pulse rounded bg-muted" />

            <div className="h-11 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container-page">
          <div className="aspect-[16/8] animate-pulse rounded-xl bg-muted" />
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-5">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />

              <div className="h-5 w-full animate-pulse rounded bg-muted" />

              <div className="h-5 w-11/12 animate-pulse rounded bg-muted" />

              <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
            </div>

            <div className="h-48 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </section>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Not found                                                                  */
/* -------------------------------------------------------------------------- */

const ProjectNotFound = () => {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <div className="container-page">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mx-auto max-w-lg text-center"
        >
          <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-muted">
            <FolderKanban className="size-6 text-muted-foreground" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            Project not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The project you're looking for doesn't exist or may no longer be
            published.
          </p>

          <Link
            to="/projects"
            className="mt-7 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectDetails;
