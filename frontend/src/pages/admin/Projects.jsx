import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { deleteProject, getProjects } from "@/api/projectApi";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import AdminProjectCard from "@/components/admin/projects/AdminProjectCard";
import AdminProjectTable from "@/components/admin/projects/AdminProjectTable";
import ProjectFilters from "@/components/admin/projects/ProjectFilters";
import { Button } from "@/components/ui/button";

const Projects = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    published: "all",
    featured: "all",
  });

  const [projectToDelete, setProjectToDelete] = useState(null);

  // --------------------------------------------------
  // Fetch projects
  // --------------------------------------------------

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  // --------------------------------------------------
  // Delete project
  // --------------------------------------------------

  const deleteMutation = useMutation({
    mutationFn: deleteProject,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      setProjectToDelete(null);

      toast.success("Project deleted successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete project.",
      );
    },
  });

  // --------------------------------------------------
  // Filter projects
  // --------------------------------------------------

  const projects = useMemo(() => {
    const data = projectsQuery.data?.projects || projectsQuery.data || [];

    if (!Array.isArray(data)) {
      return [];
    }

    const search = (filters.search ?? "").trim().toLowerCase();
    const status = filters.status ?? "all";
    const published = filters.published ?? "all";
    const featured = filters.featured ?? "all";

    const filteredProjects = data.filter((project) => {
      const matchesSearch =
        !search ||
        project.title?.toLowerCase().includes(search) ||
        project.shortDescription?.toLowerCase().includes(search) ||
        project.category?.toLowerCase().includes(search) ||
        project.technologies?.some((technology) =>
          technology?.toLowerCase().includes(search),
        );

      const matchesStatus = status === "all" || project.status === status;

      const matchesPublished =
        published === "all" ||
        (published === "published" && project.published === true) ||
        (published === "draft" && project.published !== true);

      const matchesFeatured =
        featured === "all" ||
        (featured === "featured" && project.featured === true) ||
        (featured === "standard" && project.featured !== true);

      return (
        matchesSearch && matchesStatus && matchesPublished && matchesFeatured
      );
    });

    // Featured projects first, newest projects next
    return [...filteredProjects].sort((a, b) => {
      if (Boolean(a.featured) !== Boolean(b.featured)) {
        return a.featured ? -1 : 1;
      }

      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();

      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

      return dateB - dateA;
    });
  }, [projectsQuery.data, filters]);

  // --------------------------------------------------
  // Filter handlers
  // --------------------------------------------------

  const handleFiltersChange = (nextFilters) => {
    setFilters({
      search: nextFilters?.search ?? "",
      status: nextFilters?.status ?? "all",
      published: nextFilters?.published ?? "all",
      featured: nextFilters?.featured ?? "all",
    });
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      published: "all",
      featured: "all",
    });
  };

  const hasActiveFilters =
    (filters.search ?? "").trim() !== "" ||
    filters.status !== "all" ||
    filters.published !== "all" ||
    filters.featured !== "all";

  // --------------------------------------------------
  // Delete handlers
  // --------------------------------------------------

  const handleDeleteRequest = (project) => {
    setProjectToDelete(project);
  };

  const handleDeleteConfirm = () => {
    if (!projectToDelete) {
      return;
    }

    const projectId = projectToDelete._id || projectToDelete.id;

    if (!projectId) {
      toast.error("Unable to identify this project.");
      return;
    }

    deleteMutation.mutate(projectId);
  };

  // --------------------------------------------------
  // Header
  // --------------------------------------------------

  const pageHeader = (
    <AdminPageHeader
      title="Projects"
      description="Manage the projects displayed on your portfolio."
      actionLabel="New project"
      actionHref="/admin/projects/create"
      actionIcon={Plus}
    />
  );

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (projectsQuery.isLoading) {
    return (
      <div className="space-y-6">
        {pageHeader}

        <div className="flex min-h-80 items-center justify-center rounded-xl border bg-card">
          <p className="text-sm text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (projectsQuery.isError) {
    return (
      <div className="space-y-6">
        {pageHeader}

        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border bg-card px-6 text-center">
          <p className="text-sm font-medium">Unable to load projects</p>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {projectsQuery.error?.response?.data?.message ||
              "Something went wrong while loading your projects."}
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => projectsQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Main page
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      {pageHeader}

      {/* Filters */}
      <ProjectFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClear={handleClearFilters}
      />

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
          {hasActiveFilters ? " found" : ""}
        </p>
      </div>

      {/* Empty state */}
      {projects.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border bg-muted/40">
            <Plus className="size-5 text-muted-foreground" />
          </div>

          <h2 className="mt-4 text-base font-semibold">
            {hasActiveFilters ? "No matching projects" : "No projects yet"}
          </h2>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {hasActiveFilters
              ? "Try changing your filters or search terms."
              : "Create your first project to start building your portfolio."}
          </p>

          {hasActiveFilters ? (
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={handleClearFilters}
            >
              Clear filters
            </Button>
          ) : (
            <Link
              to="/admin/projects/create"
              className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="size-4" />
              Create project
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <AdminProjectTable
            projects={projects}
            onDelete={handleDeleteRequest}
            deletingProjectId={
              deleteMutation.isPending
                ? projectToDelete?._id || projectToDelete?.id
                : null
            }
          />

          {/* Mobile and tablet cards */}
          <div className="grid gap-4 lg:hidden">
            {projects.map((project) => {
              const projectId = project._id || project.id;

              return (
                <AdminProjectCard
                  key={projectId}
                  project={project}
                  onDelete={handleDeleteRequest}
                  isDeleting={
                    deleteMutation.isPending &&
                    (projectToDelete?._id || projectToDelete?.id) === projectId
                  }
                />
              );
            })}
          </div>
        </>
      )}

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        open={Boolean(projectToDelete)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setProjectToDelete(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
        title="Delete project?"
        description={
          projectToDelete
            ? `Are you sure you want to delete "${projectToDelete.title}"? This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete project"
      />
    </div>
  );
};

export default Projects;
