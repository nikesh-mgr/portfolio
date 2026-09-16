import { useEffect, useRef, useState } from "react";

import { ImagePlus, Trash2, Upload } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const CertificateImageUploader = ({
  existingUrl = null,
  value,
  onChange,
  disabled = false,
}) => {
  const inputRef = useRef(null);

  const [preview, setPreview] = useState(existingUrl);

  useEffect(() => {
    if (value) {
      const objectUrl = URL.createObjectURL(value);

      setPreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    setPreview(existingUrl || null);
  }, [value, existingUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      onChange?.(null, "Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onChange?.(null, "Image must be smaller than 5 MB");
      return;
    }

    onChange?.(file, null);
  };

  const handleRemove = () => {
    onChange?.(null, null, true);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Certificate Image</h3>

          <p className="text-xs text-muted-foreground">
            JPEG, PNG or WebP · Maximum 5 MB
          </p>
        </div>
      </div>

      {preview ? (
        <div className="relative overflow-hidden rounded-xl border bg-muted/20">
          <img
            src={preview}
            alt="Certificate preview"
            className="aspect-video w-full object-contain"
          />

          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background/90 text-destructive shadow-sm transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Remove certificate image"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex min-h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-8 text-center transition hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border bg-background">
            <ImagePlus className="h-5 w-5" />
          </div>

          <span className="text-sm font-medium">Upload certificate image</span>

          <span className="mt-1 text-xs text-muted-foreground">
            Click to select an image
          </span>
        </button>
      )}

      {!preview && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          Choose image
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
};

export default CertificateImageUploader;
