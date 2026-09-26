import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { createProject } from "@/api/projectApi";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProjectForm from "@/components/admin/projects/ProjectForm";
import { Button } from "@/components/ui/button";

const ProjectCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProject,

    onSuccess: async (response) => {
      /*
       * The projects list may now contain a newly created project,
       * so invalidate the list cache after successful creation.
       */
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      toast.success(response?.message || "Project created successfully.");

      navigate("/admin/projects");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create project.",
      );
    },
  });

  const handleSubmit = (formData) => {
    const payload = new FormData();

    /*
     * Basic project information.
     */
    payload.append("title", formData.title.trim());
    payload.append("shortDescription", formData.shortDescription.trim());
    payload.append("description", formData.description.trim());
    payload.append("category", formData.category.trim());

    /*
     * Send each technology as a separate multipart field.
     *
     * Example:
     * technologies=React
     * technologies=Node.js
     * technologies=MongoDB
     */
    formData.technologies.forEach((technology) => {
      const cleanedTechnology = technology.trim();

      if (cleanedTechnology) {
        payload.append("technologies", cleanedTechnology);
      }
    });

    /*
     * Optional URLs.
     *
     * Omit empty values instead of sending "".
     */
    if (formData.githubUrl?.trim()) {
      payload.append("githubUrl", formData.githubUrl.trim());
    }

    if (formData.liveUrl?.trim()) {
      payload.append("liveUrl", formData.liveUrl.trim());
    }

    /*
     * FormData transmits primitive values as strings.
     * Backend multipart normalization converts them to their
     * appropriate boolean/number types before Zod validation.
     */
    payload.append("featured", String(formData.featured));
    payload.append("published", String(formData.published));
    payload.append("status", formData.status);
    payload.append("order", String(formData.order));

    /*
     * Upload the primary image only when a new File exists.
     */
    if (formData.image instanceof File) {
      payload.append("image", formData.image);
    }

    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Create project"
        description="Add a new project to your portfolio."
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
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create project"
      />
    </div>
  );
};

export default ProjectCreate;
