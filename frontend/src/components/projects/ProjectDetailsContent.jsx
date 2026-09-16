import { ArrowLeft, ExternalLink, Layers3 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const getImageUrl = (project) => {
  if (typeof project.featuredImage === "string") {
    return project.featuredImage;
  }

  return project.image?.url || project.featuredImage || project.image || null;
};

const ProjectDetailsContent = ({ project }) => {
  const imageUrl = getImageUrl(project);

  return (
    <article>
      {/* Header */}
      <section className="border-b py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mt-10 max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-2">
              {project.featured && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Featured project
                </span>
              )}

              <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                Project
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              {project.title || "Untitled project"}
            </h1>

            {project.shortDescription && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
                {project.shortDescription}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Live Demo
                  <ExternalLink className="size-4" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <FaGithub className="size-4" />
                  View Source
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured image */}
      {imageUrl && (
        <section className="border-b py-8 sm:py-12">
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
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
              className="overflow-hidden rounded-xl border bg-muted"
            >
              <img
                src={imageUrl}
                alt={project.title || "Project preview"}
                className="max-h-[700px] w-full object-cover"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20">
            {/* Description */}
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                About the project
              </p>

              <div className="mt-6">
                {project.description ? (
                  <ProjectDescription description={project.description} />
                ) : (
                  <p className="text-base leading-8 text-muted-foreground">
                    No detailed project description is available yet.
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="h-fit rounded-xl border bg-muted/20 p-6 lg:sticky lg:top-28">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Layers3 className="size-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold">Technologies</p>

                  <p className="text-xs text-muted-foreground">Built with</p>
                </div>
              </div>

              {Array.isArray(project.technologies) &&
              project.technologies.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-muted-foreground">
                  Technologies not specified.
                </p>
              )}

              {(project.githubUrl || project.liveUrl) && (
                <div className="mt-7 border-t pt-6">
                  <p className="text-sm font-semibold">Project links</p>

                  <div className="mt-4 space-y-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <FaGithub className="size-4" />
                        GitHub repository
                        <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <ExternalLink className="size-4" />
                        Live website
                        <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-6 rounded-xl border bg-muted/20 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold">
                Interested in working together?
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Let's discuss your next project or opportunity.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Get in touch
              <ExternalLink className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
};

const ProjectDescription = ({ description }) => {
  const paragraphs = description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${paragraph.slice(0, 30)}-${index}`}
          className="text-base leading-8 text-muted-foreground sm:text-lg"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default ProjectDetailsContent;
