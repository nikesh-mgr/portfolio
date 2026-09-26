import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { deleteProjectImage, uploadProjectImages } from "@/api/projectApi";

import { Button } from "@/components/ui/button";

const MAX_GALLERY_IMAGES = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ProjectGallery = ({
  projectId,
  images = [],
  onUpdated,
  disabled = false,
}) => {
  const inputRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState(null);

  const currentImages = Array.isArray(images) ? images : [];

  const totalImages = currentImages.length + selectedFiles.length;

  const remainingSlots = Math.max(
    0,
    MAX_GALLERY_IMAGES - currentImages.length - selectedFiles.length,
  );

  const handleSelect = () => {
    if (currentImages.length + selectedFiles.length >= MAX_GALLERY_IMAGES) {
      toast.error(
        `A project can have a maximum of ${MAX_GALLERY_IMAGES} gallery images.`,
      );

      return;
    }

    inputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    /*
     * Reset the input so selecting the same file again
     * triggers onChange.
     */
    event.target.value = "";

    if (!files.length) {
      return;
    }

    const availableSlots =
      MAX_GALLERY_IMAGES - currentImages.length - selectedFiles.length;

    if (availableSlots <= 0) {
      toast.error(`You can only have ${MAX_GALLERY_IMAGES} gallery images.`);

      return;
    }

    /*
     * Validate the same MIME types accepted by the backend
     * upload middleware.
     */
    const invalidTypeFiles = files.filter(
      (file) => !ALLOWED_IMAGE_TYPES.includes(file.type),
    );

    if (invalidTypeFiles.length > 0) {
      toast.error("Only JPEG, PNG, and WebP images are allowed.");
    }

    const validTypeFiles = files.filter((file) =>
      ALLOWED_IMAGE_TYPES.includes(file.type),
    );

    /*
     * Prevent unnecessarily selecting files larger than the
     * backend's 5 MB image limit.
     */
    const oversizedFiles = validTypeFiles.filter(
      (file) => file.size > MAX_IMAGE_SIZE,
    );

    if (oversizedFiles.length > 0) {
      toast.error("Each gallery image must be 5 MB or smaller.");
    }

    const validFiles = validTypeFiles.filter(
      (file) => file.size <= MAX_IMAGE_SIZE,
    );

    const filesToAdd = validFiles.slice(0, availableSlots);

    if (filesToAdd.length < validFiles.length) {
      toast.error(
        `Only ${availableSlots} more gallery image${
          availableSlots === 1 ? "" : "s"
        } can be added.`,
      );
    }

    if (!filesToAdd.length) {
      return;
    }

    setSelectedFiles((previous) => [...previous, ...filesToAdd]);
  };

  const handleRemoveSelected = (index) => {
    setSelectedFiles((previous) =>
      previous.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || !projectId) {
      return;
    }

    setIsUploading(true);

    try {
      await uploadProjectImages({
        id: projectId,
        files: selectedFiles,
      });

      toast.success("Gallery images uploaded successfully.");

      setSelectedFiles([]);

      await onUpdated?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to upload gallery images.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (image) => {
    /*
     * The backend deletes the Cloudinary asset using its publicId.
     *
     * Do not use the image URL as the deletion identifier.
     */
    const publicId =
      typeof image === "object" && image !== null ? image.publicId : null;

    const imageUrl = typeof image === "string" ? image : image?.url;

    if (!publicId) {
      toast.error(
        "This gallery image cannot be deleted because its Cloudinary public ID is missing.",
      );

      return;
    }

    if (!imageUrl) {
      toast.error("Gallery image URL is missing.");

      return;
    }

    setDeletingImageId(publicId);

    try {
      await deleteProjectImage({
        id: projectId,
        publicId,
      });

      toast.success("Gallery image deleted successfully.");

      await onUpdated?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete gallery image.",
      );
    } finally {
      setDeletingImageId(null);
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        disabled={
          disabled ||
          isUploading ||
          currentImages.length + selectedFiles.length >= MAX_GALLERY_IMAGES
        }
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">Project gallery</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Add additional screenshots, previews, or project images.
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          {totalImages}/{MAX_GALLERY_IMAGES} images
        </div>
      </div>

      {/* Existing Images */}
      {currentImages.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {currentImages.map((image, index) => {
            const imageUrl = typeof image === "string" ? image : image?.url;

            const publicId =
              typeof image === "object" && image !== null
                ? image.publicId
                : null;

            if (!imageUrl) {
              return null;
            }

            const isDeleting = deletingImageId === publicId;

            return (
              <div
                key={`${publicId || imageUrl}-${index}`}
                className="group overflow-hidden rounded-xl border bg-card"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={imageUrl}
                    alt={`Project gallery image ${index + 1}`}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />

                  <div className="absolute right-3 top-3">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(image)}
                      disabled={
                        disabled || isDeleting || isUploading || !publicId
                      }
                      aria-label={`Delete gallery image ${index + 1}`}
                    >
                      {isDeleting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="px-3 py-2.5">
                  <p className="text-xs text-muted-foreground">
                    Gallery image {index + 1}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
          <span className="mb-3 flex size-11 items-center justify-center rounded-full border bg-background">
            <ImagePlus className="size-5 text-muted-foreground" />
          </span>

          <p className="text-sm font-medium">No gallery images yet</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Add screenshots or additional project images.
          </p>
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
          <div>
            <h4 className="text-sm font-medium">Images ready to upload</h4>

            <p className="mt-1 text-xs text-muted-foreground">
              These images have not been uploaded yet.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {selectedFiles.map((file, index) => (
              <SelectedImage
                key={`${file.name}-${file.lastModified}-${index}`}
                file={file}
                index={index}
                onRemove={() => handleRemoveSelected(index)}
                disabled={isUploading}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedFiles([])}
              disabled={isUploading}
            >
              Clear selection
            </Button>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || disabled || selectedFiles.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  Upload {selectedFiles.length}{" "}
                  {selectedFiles.length === 1 ? "image" : "images"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Add Images */}
      {remainingSlots > 0 && (
        <button
          type="button"
          onClick={handleSelect}
          disabled={disabled || isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed bg-background px-4 py-4 text-sm font-medium transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <ImagePlus className="size-4" />
          Add gallery images
        </button>
      )}

      {remainingSlots <= 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Maximum of {MAX_GALLERY_IMAGES} gallery images reached.
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        JPEG, PNG, or WebP · Maximum 5 MB each · Up to {MAX_GALLERY_IMAGES}{" "}
        gallery images.
      </p>
    </div>
  );
};

const SelectedImage = ({ file, index, onRemove, disabled = false }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {preview && (
          <img
            src={preview}
            alt={`Selected gallery image ${index + 1}`}
            className="size-full object-cover"
          />
        )}

        <div className="absolute right-3 top-3">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove selected image ${index + 1}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="truncate px-3 py-2.5 text-xs text-muted-foreground">
        {file.name}
      </div>
    </div>
  );
};

export default ProjectGallery;
