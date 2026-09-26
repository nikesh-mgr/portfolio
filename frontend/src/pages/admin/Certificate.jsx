import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  createCertificate,
  deleteCertificate,
  deleteCertificateImage,
  getAdminCertificates,
  updateCertificate,
  uploadCertificateImage,
} from "@/api/certificateApi";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CertificateForm from "@/components/admin/certificate/CertificateForm";
import CertificateList from "@/components/admin/certificate/CertificateList";
import { Button } from "@/components/ui/button";

const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.message || error?.message || fallbackMessage;
};

const Certificate = () => {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /*
   * --------------------------------------------------------------------------
   * Certificates Query
   * --------------------------------------------------------------------------
   */

  const certificatesQuery = useQuery({
    queryKey: ["certificates", "admin"],
    queryFn: getAdminCertificates,
  });

  const certificates =
    certificatesQuery.data?.certificates || certificatesQuery.data?.data || [];

  /*
   * --------------------------------------------------------------------------
   * Query Invalidation
   * --------------------------------------------------------------------------
   */

  const invalidateCertificates = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["certificates"],
    });
  };

  /*
   * --------------------------------------------------------------------------
   * Create Certificate
   * --------------------------------------------------------------------------
   */

  const createMutation = useMutation({
    mutationFn: createCertificate,

    onSuccess: async () => {
      await invalidateCertificates();

      toast.success("Certificate created successfully.");

      setEditingCertificate(null);
      setShowForm(false);
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create certificate."));
    },
  });

  /*
   * --------------------------------------------------------------------------
   * Update Certificate
   * --------------------------------------------------------------------------
   */

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCertificate(id, data),

    onSuccess: async () => {
      await invalidateCertificates();

      toast.success("Certificate updated successfully.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update certificate."));
    },
  });

  /*
   * --------------------------------------------------------------------------
   * Upload Certificate Image
   * --------------------------------------------------------------------------
   */

  const uploadImageMutation = useMutation({
    mutationFn: ({ id, image }) => uploadCertificateImage(id, image),

    onSuccess: async () => {
      await invalidateCertificates();

      toast.success("Certificate image updated successfully.");
    },

    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Failed to update certificate image."),
      );
    },
  });

  /*
   * --------------------------------------------------------------------------
   * Delete Certificate Image
   * --------------------------------------------------------------------------
   */

  const deleteImageMutation = useMutation({
    mutationFn: deleteCertificateImage,

    onSuccess: async () => {
      await invalidateCertificates();

      toast.success("Certificate image removed successfully.");
    },

    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Failed to remove certificate image."),
      );
    },
  });

  /*
   * --------------------------------------------------------------------------
   * Delete Certificate
   * --------------------------------------------------------------------------
   */

  const deleteMutation = useMutation({
    mutationFn: deleteCertificate,

    onSuccess: async (_, deletedCertificateId) => {
      await invalidateCertificates();

      toast.success("Certificate deleted successfully.");

      setDeleteTarget(null);

      if (editingCertificate?._id === deletedCertificateId) {
        setEditingCertificate(null);
        setShowForm(false);
      }
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete certificate."));
    },
  });

  /*
   * --------------------------------------------------------------------------
   * Combined Submission State
   * --------------------------------------------------------------------------
   */

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadImageMutation.isPending ||
    deleteImageMutation.isPending ||
    deleteMutation.isPending;

  /*
   * --------------------------------------------------------------------------
   * Create / Update Form Submission
   * --------------------------------------------------------------------------
   */

  const handleSubmit = async (data, imageState) => {
    /*
     * Editing an existing certificate:
     *
     * 1. Update certificate metadata.
     * 2. Upload a new image if selected.
     * 3. Delete the existing image if requested.
     */

    if (editingCertificate) {
      const certificateId = editingCertificate._id;

      await updateMutation.mutateAsync({
        id: certificateId,
        data,
      });

      if (imageState?.file) {
        await uploadImageMutation.mutateAsync({
          id: certificateId,
          image: imageState.file,
        });
      } else if (imageState?.remove) {
        await deleteImageMutation.mutateAsync(certificateId);
      }

      setEditingCertificate(null);
      setShowForm(false);

      return;
    }

    /*
     * Creating a new certificate.
     *
     * The image is sent together with the certificate data
     * through the createCertificate API function.
     */

    await createMutation.mutateAsync({
      data,
      image: imageState?.file || null,
    });
  };

  /*
   * --------------------------------------------------------------------------
   * Create
   * --------------------------------------------------------------------------
   */

  const handleCreate = () => {
    setEditingCertificate(null);
    setShowForm(true);
  };

  /*
   * --------------------------------------------------------------------------
   * Edit
   * --------------------------------------------------------------------------
   */

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);
    setShowForm(true);
  };

  /*
   * --------------------------------------------------------------------------
   * Delete
   * --------------------------------------------------------------------------
   */

  const handleDelete = (certificate) => {
    setDeleteTarget(certificate);
  };

  const confirmDelete = () => {
    if (!deleteTarget?._id || deleteMutation.isPending) {
      return;
    }

    deleteMutation.mutate(deleteTarget._id);
  };

  /*
   * --------------------------------------------------------------------------
   * Cancel Form
   * --------------------------------------------------------------------------
   */

  const handleCancel = () => {
    if (isSubmitting) {
      return;
    }

    setEditingCertificate(null);
    setShowForm(false);
  };

  /*
   * --------------------------------------------------------------------------
   * Loading State
   * --------------------------------------------------------------------------
   */

  if (certificatesQuery.isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Certificates"
          description="Manage your professional certificates and credentials."
        />

        <div className="flex min-h-64 items-center justify-center rounded-xl border bg-card">
          <p className="text-sm text-muted-foreground">
            Loading certificates...
          </p>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------------------------------------------------
   * Error State
   * --------------------------------------------------------------------------
   */

  if (certificatesQuery.isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Certificates"
          description="Manage your professional certificates and credentials."
        />

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <p className="font-medium text-destructive">
            Failed to load certificates.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {getErrorMessage(certificatesQuery.error, "Please try again.")}
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => certificatesQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------------------------------------------------
   * Main Page
   * --------------------------------------------------------------------------
   */

  return (
    <div className="space-y-6">
      {/* Page Header + Create Button */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <AdminPageHeader
          title="Certificates"
          description="Manage your professional certificates and credentials."
        />

        {!showForm && (
          <Button
            type="button"
            onClick={handleCreate}
            disabled={isSubmitting}
            className="w-full shrink-0 gap-2 sm:w-auto"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Certificate
          </Button>
        )}
      </div>

      {/* Create / Edit Form */}
      {showForm ? (
        <CertificateForm
          initialData={editingCertificate}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      ) : (
        /* Certificate List */
        <CertificateList
          certificates={certificates}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-certificate-title"
        >
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-lg">
            <h2 id="delete-certificate-title" className="text-lg font-semibold">
              Delete certificate?
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget.title}
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={deleteMutation.isPending}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={confirmDelete}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificate;
