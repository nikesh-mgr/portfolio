import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const CertificateImageUploader = ({
  existingUrl = null,
  onChange,
  disabled = false,
}) => {
  const inputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState("");

  /*
   * Create a temporary preview URL for a newly selected image.
   *
   * The previous object URL is revoked before replacing it to prevent
   * unnecessary memory usage.
   */
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayUrl = previewUrl || existingUrl;

  const resetInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Please select a JPEG, PNG, or WebP image.");

      resetInput();

      onChange?.(null, "Please select a JPEG, PNG, or WebP image.", false);

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageError("Image size must not exceed 5MB.");

      resetInput();

      onChange?.(null, "Image size must not exceed 5MB.", false);

      return;
    }

    /*
     * The parent form now has a valid replacement image.
     */
    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
    setImageError("");

    onChange?.(file, null, false);
  };

  const handleRemove = () => {
    setImageError("");
    setPreviewUrl(null);
    resetInput();

    /*
     * `remove = true` tells the parent that an existing image should
     * be deleted rather than simply leaving the current image unchanged.
     */
    onChange?.(null, null, true);
  };

  const handleUploadClick = () => {
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Certificate Image</p>

          <p className="text-xs text-muted-foreground">
            JPEG, PNG, or WebP · Maximum 5MB
          </p>
        </div>

        {displayUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
            aria-label="Remove certificate image"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        )}
      </div>

      <div
        className="overflow-hidden rounded-xl border bg-muted/20"
        aria-describedby={imageError ? "certificate-image-error" : undefined}
      >
        {displayUrl ? (
          <div className="relative flex min-h-64 items-center justify-center p-4">
            <img
              src={displayUrl}
              alt="Certificate preview"
              className="max-h-80 w-full object-contain"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={disabled}
            className="flex min-h-64 w-full flex-col items-center justify-center gap-3 p-6 text-center transition-colors hover:bg-muted/40 disabled:pointer-events-none disabled:opacity-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background">
              <ImagePlus
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-sm font-medium">Upload certificate image</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Click to select an image
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
              <Upload className="h-4 w-4" aria-hidden="true" />
              Choose image
            </span>
          </button>
        )}
      </div>

      {displayUrl && (
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Replace image
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled}
        className="sr-only"
        aria-label="Choose certificate image"
      />

      {imageError && (
        <p
          id="certificate-image-error"
          role="alert"
          className="text-sm text-destructive"
        >
          {imageError}
        </p>
      )}
    </div>
  );
};

export default CertificateImageUploader;
