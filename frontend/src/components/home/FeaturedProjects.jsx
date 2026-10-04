import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ExternalLink, FolderKanban } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

import { getProjects } from "@/api/projectApi";

const FeaturedProjects = () => {
  const shouldReduceMotion = useReducedMotion();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projects = data?.projects || [];

  const featuredProjects = projects
    .filter((project) => project.featured)
    .sort((firstProject, secondProject) => {
      return (
        (firstProject.order ?? 0) - (secondProject.order ?? 0) ||
        new Date(secondProject.createdAt || 0) -
          new Date(firstProject.createdAt || 0)
      );
    })
    .slice(0, 3);

  const reveal = (delay = 0) => ({
    initial: shouldReduceMotion
      ? false
      : {
          opacity: 0,
          y: 24,
        },
    whileInView: {
      opacity: 1,
      y: 0,
    },
    viewport: {
      once: true,
      amount: 0.12,
    },
    transition: shouldReduceMotion
      ? { duration: 0 }
      : {
          duration: 0.55,
          delay,
          ease: "easeOut",
        },
  });

  return (
    <section
      id="projects"
      aria-labelledby="featured-projects-heading"
      className="relative overflow-hidden border-t py-20 sm:py-24 lg:py-32"
    >
      {/* Ambient decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 size-80 rounded-full bg-primary/[0.035] blur-3xl"
      />

      <div className="container-page relative">
        {/* ------------------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------------------ */}

        <motion.div
          {...reveal()}
          className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-primary sm:w-10"
              />

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
                Selected Work
              </p>
            </div>

            <h2
              id="featured-projects-heading"
              className="max-w-2xl text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl"
            >
              Projects built to solve real problems.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:text-lg">
              A selection of applications and systems I've designed and
              developed using modern technologies.
            </p>
          </div>

          <Link
            to="/projects"
            className="group inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-md border bg-background px-4 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:self-auto"
          >
            View all projects
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* ------------------------------------------------------------ */}
        {/* LOADING */}
        {/* ------------------------------------------------------------ */}

        {isLoading && (
          <div
            aria-label="Loading featured projects"
            aria-busy="true"
            className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {[1, 2, 3].map((item) => (
              <ProjectSkeleton key={item} />
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* ERROR */}
        {/* ------------------------------------------------------------ */}

        {!isLoading && isError && (
          <motion.div
            {...reveal()}
            role="alert"
            className="mt-12 rounded-2xl border border-destructive/20 bg-destructive/[0.035] p-8 text-center sm:p-10"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl border bg-background">
              <FolderKanban
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </div>

            <h3 className="mt-5 font-semibold">Projects couldn't be loaded</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              There was a problem loading the project portfolio.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 inline-flex min-h-10 items-center justify-center rounded-md border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Try again
            </button>
          </motion.div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* EMPTY */}
        {/* ------------------------------------------------------------ */}

        {!isLoading && !isError && featuredProjects.length === 0 && (
          <motion.div
            {...reveal()}
            className="mt-12 rounded-2xl border border-dashed p-10 text-center sm:p-14"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl border bg-muted/40">
              <FolderKanban
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </div>

            <h3 className="mt-5 font-semibold">
              Featured projects are coming soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              I'm currently preparing the featured project showcase. Check back
              soon for new work.
            </p>
          </motion.div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* PROJECT GRID */}
        {/* ------------------------------------------------------------ */}

        {!isLoading && !isError && featuredProjects.length > 0 && (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index, shouldReduceMotion }) => {
  const projectImage = project.image?.url || null;

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  const description =
    project.shortDescription ||
    project.description ||
    "A software project focused on usability, reliability, and practical problem solving.";

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 28,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.55,
              delay: index * 0.08,
              ease: "easeOut",
            }
      }
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-black/[0.045]"
    >
      {/* ------------------------------------------------------------ */}
      {/* IMAGE */}
      {/* ------------------------------------------------------------ */}

      <Link
        to={`/projects/${project.slug}`}
        aria-label={`View ${project.title}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {projectImage ? (
            <motion.img
              src={projectImage}
              alt={`${project.title} project preview`}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 1.045,
                    }
              }
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <div className="flex size-14 items-center justify-center rounded-2xl border bg-background">
                <FolderKanban
                  aria-hidden="true"
                  className="size-6 text-muted-foreground"
                />
              </div>
            </div>
          )}

          {/* Image gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70"
          />

          {/* Featured marker */}
          {project.featured && (
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-background/85 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur-md">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-primary"
                />
                Featured
              </span>
            </div>
          )}

          {/* View indicator */}
          <div
            aria-hidden="true"
            className="absolute bottom-4 right-4 flex size-9 translate-y-2 items-center justify-center rounded-full border border-white/20 bg-background/85 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ArrowRight className="size-4" />
          </div>
        </div>
      </Link>

      {/* ------------------------------------------------------------ */}
      {/* CONTENT */}
      {/* ------------------------------------------------------------ */}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex-1">
          <Link
            to={`/projects/${project.slug}`}
            className="group/title block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold leading-snug tracking-tight transition-colors duration-200 group-hover/title:text-primary">
                {project.title}
              </h3>

              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover/title:translate-x-0.5 group-hover/title:text-primary"
              >
                ↗
              </span>
            </div>
          </Link>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {technologies.slice(0, 5).map((technology) => (
                <span
                  key={technology}
                  className="rounded-md border bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors duration-200 group-hover:border-border"
                >
                  {technology}
                </span>
              ))}

              {technologies.length > 5 && (
                <span className="rounded-md border bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  +{technologies.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------- */}
        {/* ACTIONS */}
        {/* ---------------------------------------------------------- */}

        <div className="mt-6 flex items-center gap-2 border-t pt-4">
          <Link
            to={`/projects/${project.slug}`}
            className="group/action inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View project
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 group-hover/action:translate-x-0.5"
            />
          </Link>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title} source code on GitHub`}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <FaGithub aria-hidden="true" className="size-4" />
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open live demo of ${project.title}`}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const ProjectSkeleton = () => {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border bg-background"
    >
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

        <div className="border-t pt-4">
          <div className="h-10 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjects;
