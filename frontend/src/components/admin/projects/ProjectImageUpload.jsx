import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ProjectImageUpload = ({ value, onChange, disabled = false }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return undefined;
    }

    if (typeof value === "string") {
      setPreview(value);
      return undefined;
    }

    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);

      setPreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    setPreview(null);

    return undefined;
  }, [value]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Project image must be 5 MB or smaller.");
      return;
    }

    onChange(file);
  };

  const handleSelect = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleRemove = () => {
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
        aria-label="Upload project image"
      />

      {preview ? (
        <div className="overflow-hidden rounded-xl border bg-muted/20">
          <div className="relative aspect-video">
            <img
              src={preview}
              alt="Project preview"
              className="size-full object-cover"
            />

            <div className="absolute right-3 top-3">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemove}
                disabled={disabled}
                aria-label="Remove project image"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium">Project image</p>

              <p className="text-xs text-muted-foreground">
                Main image used to represent this project.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelect}
              disabled={disabled}
            >
              <Upload className="size-4" aria-hidden="true" />
              Replace
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSelect}
          disabled={disabled}
          className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="mb-3 flex size-11 items-center justify-center rounded-full border bg-background">
            <ImagePlus
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          </span>

          <span className="text-sm font-medium">Upload project image</span>

          <span className="mt-1 text-xs text-muted-foreground">
            JPEG, PNG, or WebP
          </span>
        </button>
      )}

      <p className="text-xs text-muted-foreground">
        JPEG, PNG, or WebP · Maximum 5 MB · Landscape images work best.
      </p>
    </div>
  );
};

export default ProjectImageUpload;
