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
      await queryClient.invalidateQueries({
        queryKey: ["project", id],
      });

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

    const payload = new FormData();

    /*
     * Basic project information.
     */
    payload.append("title", values.title.trim());
    payload.append("shortDescription", values.shortDescription.trim());
    payload.append("description", values.description.trim());
    payload.append("category", values.category.trim());

    /*
     * Technologies.
     *
     * FormData sends each technology as a separate field:
     *
     * technologies=React
     * technologies=Node.js
     * technologies=MongoDB
     */
    values.technologies.forEach((technology) => {
      const cleanedTechnology = technology.trim();

      if (cleanedTechnology) {
        payload.append("technologies", cleanedTechnology);
      }
    });

    /*
     * Optional GitHub URL.
     */
    if (values.githubUrl?.trim()) {
      payload.append("githubUrl", values.githubUrl.trim());
    }

    /*
     * Optional live project URL.
     */
    if (values.liveUrl?.trim()) {
      payload.append("liveUrl", values.liveUrl.trim());
    }

    /*
     * Featured status.
     *
     * All projects are published by default, so there is
     * intentionally NO `published` field here.
     */
    payload.append("featured", String(values.featured));

    /*
     * Project development status.
     */
    payload.append("status", values.status);

    /*
     * Display order.
     */
    payload.append("order", String(values.order));

    /*
     * Primary image.
     *
     * Only upload a file when the user selected a new image.
     * Otherwise, the backend keeps the existing image.
     */
    if (values.image instanceof File) {
      payload.append("image", values.image);
    }

    updateMutation.mutate({
      id,
      data: payload,
    });
  };

  /*
   * Loading state.
   */
  if (projectQuery.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  /*
   * Error state.
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
   * Support both response shapes:
   *
   * { project: {...} }
   *
   * and
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
