import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { deleteProject, getAdminProjects } from "@/api/projectApi";

import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminLoadingState from "@/components/admin/AdminLoadingState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import AdminProjectCard from "@/components/admin/projects/AdminProjectCard";
import AdminProjectTable from "@/components/admin/projects/AdminProjectTable";
import ProjectFilters from "@/components/admin/projects/ProjectFilters";

import getApiErrorMessage from "@/utils/apiErrorhandler";

const EMPTY_FILTERS = {
  search: "",
  status: "all",
  featured: "all",
};

const Projects = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: getAdminProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,

    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["projects"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["projects", "featured"],
        }),
      ]);

      const deletedProject = projectToDelete;
      setProjectToDelete(null);

      toast.success(
        response?.message ||
          `"${deletedProject?.title || "Project"}" was deleted successfully.`,
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "The project could not be deleted. Please try again.",
        ),
      );
    },
  });

  const projects = useMemo(() => {
    const data = projectsQuery.data?.projects;

    if (!Array.isArray(data)) {
      return [];
    }

    const search = filters.search.trim().toLowerCase();

    return [...data]
      .filter((project) => {
        const technologies = Array.isArray(project?.technologies)
          ? project.technologies
          : [];

        const matchesSearch =
          !search ||
          project?.title?.toLowerCase().includes(search) ||
          project?.shortDescription?.toLowerCase().includes(search) ||
          project?.category?.toLowerCase().includes(search) ||
          technologies.some((technology) =>
            String(technology).toLowerCase().includes(search),
          );

        const matchesStatus =
          filters.status === "all" || project?.status === filters.status;

        const matchesFeatured =
          filters.featured === "all" ||
          (filters.featured === "featured" && project?.featured === true) ||
          (filters.featured === "standard" && project?.featured !== true);

        return matchesSearch && matchesStatus && matchesFeatured;
      })
      .sort((first, second) => {
        if (Boolean(first?.featured) !== Boolean(second?.featured)) {
          return first?.featured ? -1 : 1;
        }

        const firstDate = new Date(
          first?.updatedAt || first?.createdAt || 0,
        ).getTime();

        const secondDate = new Date(
          second?.updatedAt || second?.createdAt || 0,
        ).getTime();

        return secondDate - firstDate;
      });
  }, [projectsQuery.data, filters]);

  const handleFiltersChange = (nextFilters) => {
    setFilters({
      search: nextFilters?.search ?? "",
      status: nextFilters?.status ?? "all",
      featured: nextFilters?.featured ?? "all",
    });
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
  };

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.featured !== "all";

  const handleDeleteRequest = (project) => {
    if (deleteMutation.isPending) {
      return;
    }

    setProjectToDelete(project);
  };

  const handleDeleteConfirm = () => {
    const projectId = projectToDelete?._id;

    if (!projectId) {
      toast.error(
        "Unable to identify this project. Please refresh the page and try again.",
      );
      return;
    }

    deleteMutation.mutate(projectId);
  };

  const pageHeader = (
    <AdminPageHeader
      title="Projects"
      description="Manage the projects displayed on your portfolio."
      actionLabel="New project"
      actionHref="/admin/projects/create"
      actionIcon={Plus}
    />
  );

  if (projectsQuery.isLoading) {
    return (
      <div className="space-y-6">
        {pageHeader}
        <AdminLoadingState message="Loading projects..." />
      </div>
    );
  }

  if (projectsQuery.isError) {
    return (
      <div className="space-y-6">
        {pageHeader}

        <AdminErrorState
          title="Unable to load projects"
          description={getApiErrorMessage(
            projectsQuery.error,
            "Something went wrong while loading your projects.",
          )}
          onRetry={() => projectsQuery.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pageHeader}

      <ProjectFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClear={handleClearFilters}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
          {hasActiveFilters ? " found" : ""}
        </p>
      </div>

      {projects.length === 0 ? (
        <AdminEmptyState
          title={hasActiveFilters ? "No matching projects" : "No projects yet"}
          description={
            hasActiveFilters
              ? "Try changing your search or filters."
              : "Create your first project to start building your portfolio."
          }
          actionLabel={hasActiveFilters ? "Clear filters" : "Create project"}
          {...(hasActiveFilters
            ? { onAction: handleClearFilters }
            : { actionHref: "/admin/projects/create" })}
        />
      ) : (
        <>
          <AdminProjectTable
            projects={projects}
            onDelete={handleDeleteRequest}
            deletingProjectId={
              deleteMutation.isPending ? projectToDelete?._id : null
            }
          />

          <div className="grid gap-4 lg:hidden">
            {projects.map((project) => (
              <AdminProjectCard
                key={project._id}
                project={project}
                onDelete={handleDeleteRequest}
                isDeleting={
                  deleteMutation.isPending &&
                  projectToDelete?._id === project._id
                }
              />
            ))}
          </div>
        </>
      )}

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
