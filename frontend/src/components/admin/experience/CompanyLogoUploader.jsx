import { useEffect, useRef, useState } from "react";

import { ImagePlus, Trash2, Upload } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const CompanyLogoUploader = ({
  value,
  existingUrl,
  onChange,
  onRemove,
  disabled = false,
}) => {
  const inputRef = useRef(null);

  const [preview, setPreview] = useState(existingUrl || null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (value instanceof File) {
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

    if (!file) {
      return;
    }

    setError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Logo must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    onChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onRemove();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Company Logo</p>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG or WebP · maximum 5 MB
          </p>
        </div>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
            Remove
          </button>
        )}
      </div>

      {preview ? (
        <div className="flex items-center gap-4 rounded-xl border bg-muted/20 p-4">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background">
            <img
              src={preview}
              alt="Company logo preview"
              className="size-full object-contain p-2"
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium">
              {value instanceof File ? value.name : "Current company logo"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {value instanceof File
                ? "New logo selected"
                : "Existing logo will be kept"}
            </p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="flex min-h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-8 text-center transition-colors hover:bg-muted/40 disabled:pointer-events-none disabled:opacity-50"
        >
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg border bg-background">
            <ImagePlus className="size-5 text-muted-foreground" />
          </div>

          <span className="text-sm font-medium">
            Upload company logo
          </span>

          <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Upload className="size-3.5" />
            Choose image
          </span>
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

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default CompanyLogoUploader;