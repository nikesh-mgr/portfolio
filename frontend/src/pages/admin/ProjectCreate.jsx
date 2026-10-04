import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { createProject } from "@/api/projectApi";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
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

const ProjectCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProject,

    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["projects"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["projects", "featured"],
        }),
      ]);

      toast.success(response?.message || "Project created successfully.");

      navigate("/admin/projects");
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "The project could not be created. Please review the form and try again.",
        ),
      );
    },
  });

  const handleSubmit = (values) => {
    createMutation.mutate(buildProjectFormData(values));
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
            disabled={createMutation.isPending}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
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
