import { useMemo, useState } from "react";
import { BriefcaseBusiness, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { getProjects } from "@/api/projectApi";
import ProjectFilters from "@/components/projects/ProjectFilters";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

const Projects = () => {
  const [search, setSearch] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("all");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projects = useMemo(() => {
    const projectList = data?.projects || data?.data || [];

    return [...projectList].sort((first, second) => {
      if (first.featured !== second.featured) {
        return Number(second.featured) - Number(first.featured);
      }

      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
    });
  }, [data]);

  const technologies = useMemo(() => {
    const technologySet = new Set();

    projects.forEach((project) => {
      if (!Array.isArray(project.technologies)) {
        return;
      }

      project.technologies.forEach((technology) => {
        if (technology) {
          technologySet.add(String(technology));
        }
      });
    });

    return Array.from(technologySet).sort((first, second) =>
      first.localeCompare(second),
    );
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return projects.filter((project) => {
      const projectTechnologies = Array.isArray(project.technologies)
        ? project.technologies
        : [];

      const searchableContent = [
        project.title,
        project.shortDescription,
        project.description,
        project.category,
        ...projectTechnologies,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableContent.includes(normalizedSearch);

      const matchesTechnology =
        selectedTechnology === "all" ||
        projectTechnologies.some(
          (technology) =>
            String(technology).toLowerCase() ===
            selectedTechnology.toLowerCase(),
        );

      return matchesSearch && matchesTechnology;
    });
  }, [projects, search, selectedTechnology]);

  const clearFilters = () => {
    setSearch("");
    setSelectedTechnology("all");
  };

  const hasActiveFilters =
    search.trim().length > 0 || selectedTechnology !== "all";

  return (
    <div className="container-page py-16 sm:py-20 lg:py-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto mb-10 max-w-3xl"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <BriefcaseBusiness className="size-3.5" />
          Projects
        </div>

        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Things I've built.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          A collection of projects focused on solving real problems through
          thoughtful design, reliable engineering, and modern technologies.
        </p>
      </motion.header>

      {/* Filters */}
      {!isLoading && !isError && projects.length > 0 && (
        <ProjectFilters
          search={search}
          selectedTechnology={selectedTechnology}
          technologies={technologies}
          resultCount={filteredProjects.length}
          totalCount={projects.length}
          onSearchChange={setSearch}
          onTechnologyChange={setSelectedTechnology}
          onClear={clearFilters}
        />
      )}

      {/* Loading */}
      {isLoading && <ProjectsGrid projects={[]} isLoading />}

      {/* Error */}
      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-xl rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"
        >
          <h2 className="text-lg font-semibold">Unable to load projects</h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {error?.response?.data?.message ||
              "Something went wrong while loading the projects."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </motion.div>
      )}

      {/* No Projects */}
      {!isLoading && !isError && projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card p-10 text-center"
        >
          <BriefcaseBusiness className="mx-auto size-10 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-semibold">No projects yet</h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Projects will appear here once they are added to the portfolio.
          </p>
        </motion.div>
      )}

      {/* No Matching Projects */}
      {!isLoading &&
        !isError &&
        projects.length > 0 &&
        filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border bg-card p-10 text-center"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <Search className="size-5 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-xl font-semibold">No matching projects</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Try a different search term or technology filter.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <X className="size-4" />
                Clear filters
              </button>
            )}
          </motion.div>
        )}

      {/* Projects Grid */}
      {!isLoading && !isError && filteredProjects.length > 0 && (
        <ProjectsGrid projects={filteredProjects} />
      )}

      {/* CTA */}
      {!isLoading && !isError && projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-16 rounded-2xl border bg-muted/30 p-8 text-center sm:p-10"
        >
          <h2 className="text-2xl font-semibold tracking-tight">
            Have a project in mind?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            I'm always interested in working on meaningful products and solving
            challenging problems.
          </p>

          <Link
            to="/contact"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Let's work together
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Projects;
