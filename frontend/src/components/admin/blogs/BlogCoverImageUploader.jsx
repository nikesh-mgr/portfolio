import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const BlogCoverImageUploader = ({
  value = null,
  onChange,
  disabled = false,
}) => {
  const inputRef = useRef(null);
  const objectUrlRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [isPreparing, setIsPreparing] = useState(false);

  useEffect(() => {
    let imageUrl = null;

    if (typeof value === "string" && value) {
      imageUrl = value;
    } else if (value && typeof value === "object") {
      imageUrl = value.preview || value.url || null;
    }

    setPreview(imageUrl);

    return () => {
      if (objectUrlRef.current && objectUrlRef.current !== imageUrl) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [value]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

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

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed.");
      resetInput();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must not exceed 5 MB.");
      resetInput();
      return;
    }

    setIsPreparing(true);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);

    objectUrlRef.current = objectUrl;
    setPreview(objectUrl);

    onChange?.({
      file,
      preview: objectUrl,
      existingUrl: null,
      remove: false,
    });

    setIsPreparing(false);
    resetInput();
  };

  const handleRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setPreview(null);

    onChange?.({
      file: null,
      preview: null,
      existingUrl: null,
      remove: true,
    });

    resetInput();
  };

  const handleChoose = () => {
    if (disabled || isPreparing) {
      return;
    }

    inputRef.current?.click();
  };

  return (
    <div className="space-y-4" aria-busy={isPreparing}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isPreparing}
        aria-label="Upload blog cover image"
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-xl border bg-muted">
          <img
            src={preview}
            alt="Blog cover preview"
            decoding="async"
            className="aspect-video w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 bg-black/60 p-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleChoose}
              disabled={disabled || isPreparing}
            >
              {isPreparing ? (
                <>
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Preparing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
                  Change Image
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
              disabled={disabled || isPreparing}
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleChoose}
          disabled={disabled || isPreparing}
          aria-label="Upload blog cover image"
          className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 transition hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPreparing ? (
            <Loader2
              className="mb-3 h-8 w-8 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : (
            <ImagePlus className="mb-3 h-8 w-8" aria-hidden="true" />
          )}

          <span className="text-sm font-medium">
            {isPreparing ? "Preparing image..." : "Upload cover image"}
          </span>

          <span className="mt-1 text-xs text-muted-foreground">
            JPG, PNG, WEBP up to 5 MB
          </span>
        </button>
      )}
    </div>
  );
};

export default BlogCoverImageUploader;
