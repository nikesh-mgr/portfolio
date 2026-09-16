import { useMemo, useState } from "react";

import { Briefcase, Plus, RefreshCw, Search } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import {
  createExperience,
  deleteExperience,
  getExperiences,
  updateExperience,
} from "@/api/experienceApi";

import ExperienceForm from "@/components/admin/experience/ExperienceForm";
import ExperienceList from "@/components/admin/experience/ExperienceList";

const Experience = () => {
  const queryClient = useQueryClient();

  const [mode, setMode] = useState("list");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["experiences"],
    queryFn: getExperiences,
  });

  const experiences = useMemo(() => {
    const items = data?.experiences || data?.data || [];

    const normalizedSearch = search.trim().toLowerCase();

    return [...items]
      .filter((experience) => {
        if (!normalizedSearch) {
          return true;
        }

        return [
          experience.company,
          experience.position,
          experience.location,
          experience.employmentType,
          ...(experience.technologies || []),
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));
      })
      .sort((a, b) => {
        if (Boolean(a.current) !== Boolean(b.current)) {
          return a.current ? -1 : 1;
        }

        const startDateDifference =
          new Date(b.startDate || 0) - new Date(a.startDate || 0);

        if (startDateDifference !== 0) {
          return startDateDifference;
        }

        return (a.order || 0) - (b.order || 0);
      });
  }, [data, search]);

  const createMutation = useMutation({
    mutationFn: createExperience,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["experiences"],
      });

      toast.success("Experience created successfully.");

      setMode("list");
    },

    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message ||
          "Failed to create experience.",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: experienceData }) =>
      updateExperience(id, experienceData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["experiences"],
      });

      toast.success("Experience updated successfully.");

      setMode("list");
      setSelectedExperience(null);
    },

    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message ||
          "Failed to update experience.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["experiences"],
      });

      toast.success("Experience deleted successfully.");

      setDeleteTarget(null);
    },

    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message ||
          "Failed to delete experience.",
      );
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleAdd = () => {
    setSelectedExperience(null);
    setMode("create");
  };

  const handleEdit = (experience) => {
    setSelectedExperience(experience);
    setMode("edit");
  };

  const handleCancel = () => {
    setMode("list");
    setSelectedExperience(null);
  };

  const handleSubmit = async (formData) => {
    if (mode === "edit" && selectedExperience) {
      await updateMutation.mutateAsync({
        id: selectedExperience._id || selectedExperience.id,
        data: formData,
      });

      return;
    }

    await createMutation.mutateAsync(formData);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) {
      return;
    }

    const id = deleteTarget._id || deleteTarget.id;

    deleteMutation.mutate(id);
  };

  if (mode === "create" || mode === "edit") {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div>
          <button
            type="button"
            onClick={handleCancel}
            className="mb-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to experiences
          </button>

          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="size-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {mode === "edit" ? "Edit Experience" : "Add Experience"}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "edit"
                  ? "Update your professional experience."
                  : "Add a new professional experience to your portfolio."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm sm:p-7">
          <ExperienceForm
            experience={selectedExperience}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Briefcase className="size-5 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">Experience</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage the professional experience shown on your portfolio.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search company, position, location..."
            className="w-full rounded-lg border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-xl border bg-muted/30"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <h2 className="text-base font-semibold">
            Failed to load experiences
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {error?.response?.data?.message ||
              "Something went wrong while loading your experiences."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Try again
          </button>
        </div>
      ) : (
        <ExperienceList
          experiences={experiences}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
        />
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-experience-title"
            className="w-full max-w-md rounded-xl border bg-background p-6 shadow-xl"
          >
            <h2 id="delete-experience-title" className="text-lg font-semibold">
              Delete experience?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This will permanently remove{" "}
              <strong className="text-foreground">
                {deleteTarget.position}
              </strong>{" "}
              at{" "}
              <strong className="text-foreground">
                {deleteTarget.company}
              </strong>
              .
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              The associated company logo will also be removed from Cloudinary
              by the backend.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteMutation.isPending}
                className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Experience"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;
