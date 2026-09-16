import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Award, Loader2, Plus, RefreshCw, X } from "lucide-react";

import { toast } from "sonner";

import {
  createCertificate,
  deleteCertificate,
  deleteCertificateImage,
  getCertificates,
  updateCertificate,
  uploadCertificateImage,
} from "@/api/certificateApi";

import CertificateForm from "@/components/admin/certificate/CertificateForm";
import CertificateList from "@/components/admin/certificate/CertificateList";

const Certificate = () => {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingCertificate, setEditingCertificate] = useState(null);

  const [search, setSearch] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["certificates", "admin"],
    queryFn: () =>
      getCertificates({
        visible: false,
      }),
  });

  const certificates = data?.certificates || data?.data || [];

  const createMutation = useMutation({
    mutationFn: createCertificate,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["certificates"],
      });

      toast.success("Certificate created successfully");

      setIsFormOpen(false);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create certificate",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCertificate(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["certificates"],
      });

      toast.success("Certificate updated successfully");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update certificate",
      );
    },
  });

  const imageUploadMutation = useMutation({
    mutationFn: ({ id, image }) => uploadCertificateImage(id, image),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["certificates"],
      });

      toast.success("Certificate image updated successfully");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to upload certificate image",
      );
    },
  });

  const imageDeleteMutation = useMutation({
    mutationFn: deleteCertificateImage,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["certificates"],
      });

      toast.success("Certificate image removed successfully");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove certificate image",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCertificate,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["certificates"],
      });

      toast.success("Certificate deleted successfully");

      setDeleteTarget(null);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete certificate",
      );
    },
  });

  const handleCreate = () => {
    setEditingCertificate(null);
    setIsFormOpen(true);
  };

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async ({ data: formData, image, removeImage }) => {
    if (!editingCertificate) {
      await createMutation.mutateAsync({
        data: formData,
        image,
      });

      return;
    }

    const id = editingCertificate._id;

    await updateMutation.mutateAsync({
      id,
      data: formData,
    });

    if (image) {
      await imageUploadMutation.mutateAsync({
        id,
        image,
      });
    } else if (removeImage && editingCertificate.image?.publicId) {
      await imageDeleteMutation.mutateAsync(id);
    }

    setEditingCertificate(null);
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    deleteMutation.mutate(deleteTarget._id);
  };

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    imageUploadMutation.isPending ||
    imageDeleteMutation.isPending;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-muted/30">
              <Award className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Certificates
              </h1>

              <p className="text-sm text-muted-foreground">
                Manage the certifications displayed on your portfolio.
              </p>
            </div>
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
            Add certificate
          </button>
        </div>
      </header>

      {isFormOpen && (
        <section className="rounded-xl border bg-muted/10 p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">
                {editingCertificate ? "Edit certificate" : "Add certificate"}
              </h2>

              <p className="text-sm text-muted-foreground">
                {editingCertificate
                  ? "Update certificate information and image."
                  : "Add a certification to your professional background."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingCertificate(null);
              }}
              disabled={isSubmitting}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-muted disabled:opacity-50"
              aria-label="Close certificate form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <CertificateForm
            initialData={editingCertificate}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingCertificate(null);
            }}
            isSubmitting={isSubmitting}
          />
        </section>
      )}

      {isLoading ? (
        <div className="flex min-h-72 items-center justify-center rounded-xl border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading certificates...
          </div>
        </div>
      ) : isError ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-destructive/20 px-6 text-center">
          <h3 className="font-semibold">Failed to load certificates</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {error?.response?.data?.message ||
              "Something went wrong while loading certificates."}
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
        <CertificateList
          certificates={certificates}
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
            aria-labelledby="delete-certificate-title"
            className="w-full max-w-md rounded-xl border bg-background p-6 shadow-xl"
          >
            <h2 id="delete-certificate-title" className="text-lg font-semibold">
              Delete certificate?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget.title}
              </span>{" "}
              and its associated certificate image.
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
                Delete certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificate;
