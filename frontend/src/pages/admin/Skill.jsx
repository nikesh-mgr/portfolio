import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Code2, Loader2, Plus, RefreshCw, X } from "lucide-react";

import { toast } from "sonner";

import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
} from "@/api/skillApi";

import SkillForm from "@/components/admin/skill/SkillForm";
import SkillList from "@/components/admin/skill/SkillList";

const SkillManagement = () => {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingSkill, setEditingSkill] = useState(null);

  const [search, setSearch] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["skills", "admin"],
    queryFn: () => getSkills(),
  });

  const skills = data?.skills || data?.data || [];

  const createMutation = useMutation({
    mutationFn: createSkill,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["skills"],
      });

      toast.success("Skill created successfully");

      setIsFormOpen(false);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create skill");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSkill(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["skills"],
      });

      toast.success("Skill updated successfully");
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update skill");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["skills"],
      });

      toast.success("Skill deleted successfully");

      setDeleteTarget(null);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete skill");
    },
  });

  const handleCreate = () => {
    setEditingSkill(null);
    setIsFormOpen(true);
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingSkill) {
      await updateMutation.mutateAsync({
        id: editingSkill._id,
        data: formData,
      });

      setEditingSkill(null);
      setIsFormOpen(false);

      return;
    }

    await createMutation.mutateAsync(formData);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(deleteTarget._id);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-muted/30">
            <Code2 className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight">Skills</h1>

            <p className="text-sm text-muted-foreground">
              Manage the technologies and tools displayed on your portfolio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />

            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add skill
          </button>
        </div>
      </header>

      {isFormOpen && (
        <section className="rounded-xl border bg-muted/10 p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">
                {editingSkill ? "Edit skill" : "Add skill"}
              </h2>

              <p className="text-sm text-muted-foreground">
                {editingSkill
                  ? "Update your skill information."
                  : "Add a technology to your portfolio."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingSkill(null);
              }}
              disabled={isSubmitting}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-muted disabled:opacity-50"
              aria-label="Close skill form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <SkillForm
            initialData={editingSkill}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingSkill(null);
            }}
            isSubmitting={isSubmitting}
          />
        </section>
      )}

      {isLoading ? (
        <div className="flex min-h-72 items-center justify-center rounded-xl border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading skills...
          </div>
        </div>
      ) : isError ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-destructive/20 px-6 text-center">
          <h3 className="font-semibold">Failed to load skills</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {error?.response?.data?.message ||
              "Something went wrong while loading skills."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Try again
          </button>
        </div>
      ) : (
        <SkillList
          skills={skills}
          search={search}
          onSearchChange={setSearch}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-skill-title"
            className="w-full max-w-md rounded-xl border bg-background p-6 shadow-xl"
          >
            <h2 id="delete-skill-title" className="text-lg font-semibold">
              Delete skill?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget.name}
              </span>{" "}
              from your portfolio.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteMutation.isPending}
                className="h-10 rounded-lg border px-4 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-destructive px-4 text-sm font-medium text-destructive-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {deleteMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Delete skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillManagement;
