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

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      toast.success("Project created successfully.");

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

    payload.append("title", formData.title.trim());

    payload.append("shortDescription", formData.shortDescription.trim());

    payload.append("description", formData.description.trim());

    payload.append("category", formData.category.trim());

    formData.technologies.forEach((technology) => {
      payload.append("technologies", technology);
    });

    if (formData.githubUrl?.trim()) {
      payload.append("githubUrl", formData.githubUrl.trim());
    }

    if (formData.liveUrl?.trim()) {
      payload.append("liveUrl", formData.liveUrl.trim());
    }

    payload.append("featured", String(formData.featured));

    payload.append("published", String(formData.published));

    payload.append("status", formData.status);

    payload.append("order", String(formData.order));

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
