import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CertificateImageUploader from "./CertificateImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/*
|--------------------------------------------------------------------------
| Certificate Validation
|--------------------------------------------------------------------------
|
| These client-side rules mirror the backend certificate validation as
| closely as possible so users receive immediate feedback before submitting.
|--------------------------------------------------------------------------
*/

const certificateFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Certificate title must be at least 2 characters")
    .max(150, "Certificate title cannot exceed 150 characters"),

  issuer: z
    .string()
    .trim()
    .min(2, "Certificate issuer must be at least 2 characters")
    .max(150, "Certificate issuer cannot exceed 150 characters"),

  issueDate: z
    .string()
    .min(1, "Issue date is required")
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      "Please provide a valid issue date",
    ),

  credentialId: z
    .string()
    .trim()
    .max(150, "Credential ID cannot exceed 150 characters"),

  credentialUrl: z
    .string()
    .trim()
    .max(2048, "Credential URL cannot exceed 2048 characters")
    .refine((value) => {
      if (!value) {
        return true;
      }

      try {
        const url = new URL(value);

        return ["http:", "https:"].includes(url.protocol);
      } catch {
        return false;
      }
    }, "Please provide a valid HTTP or HTTPS URL"),

  description: z
    .string()
    .trim()
    .max(500, "Certificate description cannot exceed 500 characters"),

  order: z
    .number({
      message: "Order must be a number",
    })
    .int("Order must be an integer")
    .min(0, "Order cannot be negative")
    .max(1000000, "Order cannot exceed 1000000"),

  isVisible: z.boolean(),
});

/*
|--------------------------------------------------------------------------
| Default Form Values
|--------------------------------------------------------------------------
*/

const getDefaultValues = (initialData) => ({
  title: initialData?.title || "",
  issuer: initialData?.issuer || "",

  issueDate: initialData?.issueDate
    ? new Date(initialData.issueDate).toISOString().slice(0, 10)
    : "",

  credentialId: initialData?.credentialId || "",
  credentialUrl: initialData?.credentialUrl || "",
  description: initialData?.description || "",
  order: initialData?.order ?? 0,
  isVisible: initialData?.isVisible ?? true,
});

/*
|--------------------------------------------------------------------------
| Certificate Form
|--------------------------------------------------------------------------
*/

const CertificateForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: getDefaultValues(initialData),
  });

  /*
  |--------------------------------------------------------------------------
  | Sync Form When Editing Another Certificate
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    reset(getDefaultValues(initialData));

    setImage(null);
    setImageError("");
    setRemoveImage(false);
    setExistingImageUrl(initialData?.image?.url || null);
  }, [initialData, reset]);

  /*
  |--------------------------------------------------------------------------
  | Image State Handler
  |--------------------------------------------------------------------------
  |
  | CertificateImageUploader communicates:
  |
  | file        -> newly selected image
  | error       -> client-side validation error
  | shouldRemove -> request to remove existing image
  |--------------------------------------------------------------------------
  */

  const handleImageChange = (file, error = null, shouldRemove = false) => {
    setImageError(error || "");

    if (error) {
      return;
    }

    if (shouldRemove) {
      setImage(null);
      setRemoveImage(true);
      return;
    }

    if (file) {
      setImage(file);
      setRemoveImage(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const submitForm = async (values) => {
    const normalizedValues = {
      ...values,

      title: values.title.trim(),
      issuer: values.issuer.trim(),
      credentialId: values.credentialId.trim(),
      credentialUrl: values.credentialUrl.trim(),
      description: values.description.trim(),

      order: Number(values.order),
      isVisible: Boolean(values.isVisible),
    };

    await onSubmit(normalizedValues, {
      file: image,
      remove: removeImage,
      existingUrl: existingImageUrl,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-6 rounded-xl border bg-card p-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">
          {initialData ? "Edit Certificate" : "Add Certificate"}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Add professional certification and credential information.
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="certificate-title" className="text-sm font-medium">
            Title
          </label>

          <Input
            id="certificate-title"
            placeholder="e.g. Full Stack Web Development"
            maxLength={150}
            disabled={isSubmitting}
            {...register("title")}
          />

          {errors.title && (
            <p className="text-sm text-destructive" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Issuer */}
        <div className="space-y-2">
          <label htmlFor="certificate-issuer" className="text-sm font-medium">
            Issuer
          </label>

          <Input
            id="certificate-issuer"
            placeholder="e.g. Coursera"
            maxLength={150}
            disabled={isSubmitting}
            {...register("issuer")}
          />

          {errors.issuer && (
            <p className="text-sm text-destructive" role="alert">
              {errors.issuer.message}
            </p>
          )}
        </div>

        {/* Issue Date */}
        <div className="space-y-2">
          <label
            htmlFor="certificate-issue-date"
            className="text-sm font-medium"
          >
            Issue Date
          </label>

          <Input
            id="certificate-issue-date"
            type="date"
            disabled={isSubmitting}
            {...register("issueDate")}
          />

          {errors.issueDate && (
            <p className="text-sm text-destructive" role="alert">
              {errors.issueDate.message}
            </p>
          )}
        </div>

        {/* Credential ID */}
        <div className="space-y-2">
          <label
            htmlFor="certificate-credential-id"
            className="text-sm font-medium"
          >
            Credential ID
          </label>

          <Input
            id="certificate-credential-id"
            placeholder="Optional"
            maxLength={150}
            disabled={isSubmitting}
            {...register("credentialId")}
          />

          {errors.credentialId && (
            <p className="text-sm text-destructive" role="alert">
              {errors.credentialId.message}
            </p>
          )}
        </div>

        {/* Credential URL */}
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="certificate-credential-url"
            className="text-sm font-medium"
          >
            Credential URL
          </label>

          <Input
            id="certificate-credential-url"
            type="url"
            placeholder="https://example.com/credential"
            maxLength={2048}
            disabled={isSubmitting}
            {...register("credentialUrl")}
          />

          {errors.credentialUrl && (
            <p className="text-sm text-destructive" role="alert">
              {errors.credentialUrl.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="certificate-description"
            className="text-sm font-medium"
          >
            Description
          </label>

          <Textarea
            id="certificate-description"
            placeholder="Optional description..."
            maxLength={500}
            rows={4}
            disabled={isSubmitting}
            {...register("description")}
          />

          {errors.description && (
            <p className="text-sm text-destructive" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Display Order */}
        <div className="space-y-2">
          <label htmlFor="certificate-order" className="text-sm font-medium">
            Display Order
          </label>

          <Input
            id="certificate-order"
            type="number"
            min={0}
            max={1000000}
            step={1}
            disabled={isSubmitting}
            {...register("order", {
              valueAsNumber: true,
            })}
          />

          {errors.order && (
            <p className="text-sm text-destructive" role="alert">
              {errors.order.message}
            </p>
          )}
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-3 self-end pb-2">
          <input
            id="certificate-visible"
            type="checkbox"
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-input"
            {...register("isVisible")}
          />

          <label htmlFor="certificate-visible" className="text-sm font-medium">
            Visible on public portfolio
          </label>
        </div>
      </div>

      {/* Certificate Image */}
      <CertificateImageUploader
        existingUrl={existingImageUrl}
        onChange={handleImageChange}
        disabled={isSubmitting}
      />

      {imageError && (
        <p className="text-sm text-destructive" role="alert">
          {imageError}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Certificate"
              : "Create Certificate"}
        </Button>
      </div>
    </form>
  );
};

export default CertificateForm;
