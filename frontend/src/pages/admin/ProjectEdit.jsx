import { toProjectFormData } from "@/utils/projectForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { getProjectById, updateProject } from "@/api/projectApi";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProjectGallery from "@/components/admin/projects/ProjectGallery";
import ProjectForm from "@/components/admin/projects/ProjectForm";
import { Button } from "@/components/ui/button";

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
      /*
       * Refresh the individual project cache.
       */
      await queryClient.invalidateQueries({
        queryKey: ["project"],
      });

      /*
       * Refresh the projects list.
       */
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      toast.success(response?.message || "Project updated successfully.");

      navigate("/admin/projects");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update project.",
      );
    },
  });

  const handleGalleryUpdated = async () => {
    await projectQuery.refetch();

    await queryClient.invalidateQueries({
      queryKey: ["projects"],
    });
  };

  const handleSubmit = (values) => {
    if (!id) {
      toast.error("Project ID is missing.");
      return;
    }

    const payload = toProjectFormData(values);

    updateMutation.mutate({
      id,
      data: payload,
    });
  };

  /*
   * Loading
   */
  if (projectQuery.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  /*
   * Error
   */
  if (projectQuery.isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit project"
          description="Unable to load this project."
        />

        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-sm font-medium text-destructive">
            Unable to load project
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {projectQuery.error?.response?.data?.message ||
              "Failed to load project."}
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={() => navigate("/admin/projects")}
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Button>
        </div>
      </div>
    );
  }

  /*
   * Backend response can be:
   *
   * { project: {...} }
   *
   * or
   *
   * {...project}
   */
  const project = projectQuery.data?.project || projectQuery.data;

  if (!project) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit project"
          description="Project could not be found."
        />

        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Project not found.</p>

          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={() => navigate("/admin/projects")}
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Edit project"
        description={`Update ${project.title || "project"} information.`}
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/projects")}
          >
            <ArrowLeft className="size-4" />
            Back to projects
          </Button>
        }
      />

      {/* Project Form */}
      <ProjectForm
        initialValues={project}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Save changes"
      />

      {/* Gallery */}
      <ProjectGallery
        projectId={id}
        images={project.images || []}
        onUpdated={handleGalleryUpdated}
      />
    </div>
  );
};

export default ProjectEdit;
