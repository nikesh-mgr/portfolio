import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { getProjectById, updateProject } from "@/api/projectApi";

import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminLoadingState from "@/components/admin/AdminLoadingState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProjectGallery from "@/components/admin/projects/ProjectGallery";
import ProjectForm from "@/components/admin/projects/ProjectForm";
import { Button } from "@/components/ui/button";

import getApiErrorMessage from "@/utils/apiErrorhandler";

const buildProjectFormData = (values) => {
  const payload = new FormData();

  payload.append("title", values.title.trim());
  payload.append("shortDescription", values.shortDescription.trim());
  payload.append("description", values.description.trim());
  payload.append("category", values.category.trim());

  values.technologies.forEach((technology) => {
    const cleanedTechnology = technology.trim();

    if (cleanedTechnology) {
      payload.append("technologies", cleanedTechnology);
    }
  });

  if (values.githubUrl?.trim()) {
    payload.append("githubUrl", values.githubUrl.trim());
  }

  if (values.liveUrl?.trim()) {
    payload.append("liveUrl", values.liveUrl.trim());
  }

  payload.append("featured", String(values.featured));
  payload.append("status", values.status);
  payload.append("order", String(values.order));

  if (values.image instanceof File) {
    payload.append("image", values.image);
  }

  return payload;
};

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const projectQuery = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
    enabled: Boolean(id),
  });

  const updateMutation = useMutation({
    mutationFn: updateProject,

    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["project", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["projects"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["projects", "featured"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["project", "slug"],
        }),
      ]);

      toast.success(response?.message || "Project updated successfully.");

      navigate("/admin/projects");
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "The project could not be updated. Please review the form and try again.",
        ),
      );
    },
  });

  const handleGalleryUpdated = async () => {
    await Promise.all([
      projectQuery.refetch(),
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["projects", "featured"],
      }),
    ]);
  };

  const handleSubmit = (values) => {
    if (!id) {
      toast.error(
        "The project ID is missing. Please return to the project list and try again.",
      );
      return;
    }

    updateMutation.mutate({
      id,
      data: buildProjectFormData(values),
    });
  };

  const pageHeader = (
    <AdminPageHeader
      title="Edit project"
      description="Update project information and media."
      action={
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/projects")}
          disabled={updateMutation.isPending}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to projects
        </Button>
      }
    />
  );

  if (projectQuery.isLoading) {
    return (
      <div className="space-y-6">
        {pageHeader}
        <AdminLoadingState message="Loading project..." />
      </div>
    );
  }

  if (projectQuery.isError) {
    return (
      <div className="space-y-6">
        {pageHeader}

        <AdminErrorState
          title="Unable to load project"
          description={getApiErrorMessage(
            projectQuery.error,
            "Something went wrong while loading this project.",
          )}
          onRetry={() => projectQuery.refetch()}
        />
      </div>
    );
  }

  const project = projectQuery.data?.project;

  if (!project) {
    return (
      <div className="space-y-6">
        {pageHeader}

        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-sm font-medium">Project not found.</p>

          <p className="mt-2 text-sm text-muted-foreground">
            The project may have been deleted or is no longer available.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={() => navigate("/admin/projects")}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pageHeader}

      <ProjectForm
        initialValues={project}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Save changes"
      />

      <ProjectGallery
        projectId={id}
        images={project.images || []}
        onUpdated={handleGalleryUpdated}
      />
    </div>
  );
};

export default ProjectEdit;
