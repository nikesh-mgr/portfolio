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
        queryKey: ["project", id],
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

    const payload = new FormData();

    /*
     * Basic information
     */
    payload.append("title", values.title.trim());

    payload.append("shortDescription", values.shortDescription.trim());

    payload.append("description", values.description.trim());

    payload.append("category", values.category.trim());

    /*
     * Technologies
     *
     * Backend should receive:
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
     * Optional URLs
     */
    if (values.githubUrl?.trim()) {
      payload.append("githubUrl", values.githubUrl.trim());
    } else {
      payload.append("githubUrl", "");
    }

    if (values.liveUrl?.trim()) {
      payload.append("liveUrl", values.liveUrl.trim());
    } else {
      payload.append("liveUrl", "");
    }

    /*
     * Boolean
     */
    payload.append("featured", String(values.featured));

    /*
     * Project status
     */
    payload.append("status", values.status);

    /*
     * Display order
     */
    payload.append("order", String(values.order));

    /*
     * Image
     *
     * IMPORTANT:
     *
     * Existing image = URL string
     * New image = File
     *
     * Only send the File.
     *
     * If no new image was selected, backend keeps
     * the existing image.
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
