import { ArrowRight, ExternalLink, FolderKanban } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { getPublishedProjects } from "@/api/projectApi";

const FeaturedProjects = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects", "published"],
    queryFn: getPublishedProjects,
  });

  const projects = data?.projects || data?.data || [];

  const sortedProjects = [...projects]
    .sort((firstProject, secondProject) => {
      return (
        Number(Boolean(secondProject.featured)) -
        Number(Boolean(firstProject.featured))
      );
    })
    .slice(0, 3);

  return (
    <section id="projects" className="border-t py-20 sm:py-24 lg:py-32">
      <div className="container-page">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Selected Work
            </p>

            <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Projects built to solve real problems.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              A selection of applications and systems I've designed and
              developed using modern technologies.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View all projects
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <ProjectSkeleton key={item} />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="mt-12 rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <FolderKanban className="mx-auto size-8 text-muted-foreground" />

            <h3 className="mt-4 font-semibold">Projects couldn't be loaded</h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              There was a problem loading the project portfolio. Please try
              again later.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && sortedProjects.length === 0 && (
          <div className="mt-12 rounded-xl border border-dashed p-10 text-center">
            <FolderKanban className="mx-auto size-8 text-muted-foreground" />

            <h3 className="mt-4 font-semibold">Projects are coming soon</h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              I'm currently preparing the project showcase. Check back soon for
              new work.
            </p>
          </div>
        )}

        {/* Projects */}
        {!isLoading && !isError && sortedProjects.length > 0 && (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sortedProjects.map((project, index) => (
              <ProjectCard
                key={project._id || project.id || project.slug}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }) => {
  const projectImage =
    project.image?.url || project.featuredImage || project.image || null;

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
      }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-sm"
    >
      {/* Image */}
      <Link
        to={`/projects/${project.slug}`}
        aria-label={`View ${project.title}`}
        className="block overflow-hidden border-b bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div className="aspect-[16/10] overflow-hidden">
          {projectImage ? (
            <img
              src={projectImage}
              alt={project.title || "Project preview"}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted">
              <FolderKanban className="size-10 text-muted-foreground/50" />
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex-1">
          {project.featured && (
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              Featured
            </span>
          )}

          <Link
            to={`/projects/${project.slug}`}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
              {project.title}
            </h3>
          </Link>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {project.shortDescription ||
              project.description ||
              "A modern software project built with a focus on usability and reliability."}
          </p>

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {technologies.slice(0, 5).map((technology) => (
                <span
                  key={technology}
                  className="rounded-md border bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {technology}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="mt-6 flex items-center gap-2 border-t pt-4">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View project
            <ArrowRight className="size-3.5" />
          </Link>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title} on GitHub`}
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FaGithub className="size-4" />
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open live demo of ${project.title}`}
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink className="size-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const ProjectSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="aspect-[16/10] animate-pulse bg-muted" />

      <div className="space-y-4 p-5 sm:p-6">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />

        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>

        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
          <div className="h-6 w-20 animate-pulse rounded bg-muted" />
          <div className="h-6 w-14 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjects;
