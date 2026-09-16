import { ArrowUpRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProjectCard = ({ project }) => {
  const imageUrl =
    project.image?.url || project.image.url || project.image || null;

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card"
    >
      <Link
        to={`/projects/${project.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`View ${project.title} project`}
      >
        <div className="relative aspect-video overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-muted-foreground">
                Project preview
              </span>
            </div>
          )}

          {project.featured && (
            <span className="absolute left-4 top-4 rounded-full border bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              Featured
            </span>
          )}

          <div className="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-full border bg-background/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex-1">
          <Link
            to={`/projects/${project.slug}`}
            className="group/title focus-visible:outline-none"
          >
            <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover/title:text-primary">
              {project.title}
            </h2>
          </Link>

          {project.shortDescription && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {project.shortDescription}
            </p>
          )}

          {technologies.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {technology}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t pt-5">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View project
            <ArrowUpRight className="size-4" />
          </Link>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code on GitHub`}
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FaGithub className="size-4" />
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open live demo of ${project.title}`}
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink className="size-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
