import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  CalendarDays,
  ExternalLink,
  FileText,
  Loader2,
  Save,
} from "lucide-react";

import CertificateImageUploader from "./CertificateImageUploader";

const defaultValues = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialId: "",
  credentialUrl: "",
  description: "",
  order: 0,
  isVisible: true,
};

const CertificateForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [image, setImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (!initialData) {
      reset(defaultValues);
      setImage(null);
      setRemoveImage(false);
      return;
    }

    reset({
      title: initialData.title || "",
      issuer: initialData.issuer || "",
      issueDate: initialData.issueDate
        ? new Date(initialData.issueDate).toISOString().slice(0, 10)
        : "",
      credentialId: initialData.credentialId || "",
      credentialUrl: initialData.credentialUrl || "",
      description: initialData.description || "",
      order: initialData.order ?? 0,
      isVisible: initialData.isVisible ?? true,
    });

    setImage(null);
    setRemoveImage(false);
  }, [initialData, reset]);

  const handleImageChange = (file, error, shouldRemove = false) => {
    if (error) {
      setImageError(error);
      return;
    }

    setImageError("");
    setImage(file);
    setRemoveImage(shouldRemove);
  };

  const submitForm = async (data) => {
    await onSubmit({
      data,
      image,
      removeImage,
    });
  };

  const inputClassName =
    "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10";

  const labelClassName = "mb-2 block text-sm font-medium";

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      <section className="rounded-xl border bg-card p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/30">
            <FileText className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold">Certificate Information</h2>

            <p className="text-xs text-muted-foreground">
              Basic details about the certification.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="title" className={labelClassName}>
              Certificate title
            </label>

            <input
              id="title"
              {...register("title", {
                required: "Certificate title is required",
                minLength: {
                  value: 2,
                  message: "Title must be at least 2 characters",
                },
                maxLength: {
                  value: 150,
                  message: "Title cannot exceed 150 characters",
                },
              })}
              placeholder="AWS Certified Developer"
              className={inputClassName}
              disabled={isSubmitting}
            />

            {errors.title && (
              <p className="mt-1 text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="issuer" className={labelClassName}>
              Issuer
            </label>

            <input
              id="issuer"
              {...register("issuer", {
                required: "Issuer is required",
                minLength: {
                  value: 2,
                  message: "Issuer must be at least 2 characters",
                },
                maxLength: {
                  value: 150,
                  message: "Issuer cannot exceed 150 characters",
                },
              })}
              placeholder="Amazon Web Services"
              className={inputClassName}
              disabled={isSubmitting}
            />

            {errors.issuer && (
              <p className="mt-1 text-xs text-destructive">
                {errors.issuer.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="issueDate" className={labelClassName}>
              Issue date
            </label>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="issueDate"
                type="date"
                {...register("issueDate", {
                  required: "Issue date is required",
                })}
                className={`${inputClassName} pl-10`}
                disabled={isSubmitting}
              />
            </div>

            {errors.issueDate && (
              <p className="mt-1 text-xs text-destructive">
                {errors.issueDate.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="credentialId" className={labelClassName}>
              Credential ID
            </label>

            <input
              id="credentialId"
              {...register("credentialId")}
              placeholder="ABC-123456"
              className={inputClassName}
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="credentialUrl" className={labelClassName}>
              Credential URL
            </label>

            <div className="relative">
              <ExternalLink className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="credentialUrl"
                type="url"
                {...register("credentialUrl", {
                  validate: (value) => {
                    if (!value) return true;

                    try {
                      const url = new URL(value);

                      if (!["http:", "https:"].includes(url.protocol)) {
                        return "URL must use HTTP or HTTPS";
                      }

                      return true;
                    } catch {
                      return "Please provide a valid URL";
                    }
                  },
                })}
                placeholder="https://example.com/verify"
                className={`${inputClassName} pl-10`}
                disabled={isSubmitting}
              />
            </div>

            {errors.credentialUrl && (
              <p className="mt-1 text-xs text-destructive">
                {errors.credentialUrl.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClassName}>
              Description
            </label>

            <textarea
              id="description"
              rows={4}
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description cannot exceed 500 characters",
                },
              })}
              placeholder="Briefly describe what this certification demonstrates..."
              className="w-full resize-y rounded-lg border bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
              disabled={isSubmitting}
            />

            {errors.description && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <div className="mb-5">
          <h2 className="text-sm font-semibold">Display Settings</h2>

          <p className="text-xs text-muted-foreground">
            Control how this certificate appears on your public portfolio.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="order" className={labelClassName}>
              Display order
            </label>

            <input
              id="order"
              type="number"
              min="0"
              {...register("order", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Order cannot be negative",
                },
              })}
              className={inputClassName}
              disabled={isSubmitting}
            />

            {errors.order && (
              <p className="mt-1 text-xs text-destructive">
                {errors.order.message}
              </p>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
            <input
              type="checkbox"
              {...register("isVisible")}
              disabled={isSubmitting}
              className="h-4 w-4"
            />

            <div>
              <p className="text-sm font-medium">Visible on portfolio</p>

              <p className="text-xs text-muted-foreground">
                Show this certificate publicly.
              </p>
            </div>
          </label>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <CertificateImageUploader
          existingUrl={initialData?.image?.url || null}
          value={image}
          onChange={handleImageChange}
          disabled={isSubmitting}
        />

        {imageError && (
          <p className="mt-2 text-xs text-destructive">{imageError}</p>
        )}
      </section>

      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10 rounded-lg border px-4 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {initialData ? "Save changes" : "Create certificate"}
        </button>
      </div>
    </form>
  );
};

export default CertificateForm;
