import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const BlogCoverImageUploader = ({
  value = null,
  onChange,
  disabled = false,
}) => {
  const inputRef = useRef(null);

  const preview =
    typeof value === "string" ? value : value?.preview || value?.url || null;

  const [isPreparing, setIsPreparing] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Set existing image
  |--------------------------------------------------------------------------
  */

  useEffect(
    () => () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  /*
  |--------------------------------------------------------------------------
  | Select image
  |--------------------------------------------------------------------------
  */

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Validate type
     */

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    /*
     * Validate size
     */

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must not exceed 5 MB.");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    setIsPreparing(true);

    try {
      /*
       * Create temporary preview.
       */

      const objectUrl = URL.createObjectURL(file);

      /*
       * IMPORTANT:
       *
       * existingUrl is intentionally
       * null because this is a new image.
       */

      const imageData = {
        file,
        preview: objectUrl,

        existingUrl: null,

        remove: false,
      };

      onChange?.(imageData);
    } catch {
      toast.error("Failed to prepare the image.");
    } finally {
      setIsPreparing(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Remove image
  |--------------------------------------------------------------------------
  */

  const handleRemove = () => {
    onChange?.({
      file: null,

      preview: null,

      existingUrl: null,

      remove: true,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Choose image
  |--------------------------------------------------------------------------
  */

  const handleChoose = () => {
    if (disabled || isPreparing) {
      return;
    }

    inputRef.current?.click();
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isPreparing}
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-xl border bg-muted">
          <img
            src={preview}
            alt="Blog cover preview"
            className="aspect-video w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/60 p-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleChoose}
              disabled={disabled || isPreparing}
            >
              {isPreparing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
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
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleChoose}
          disabled={disabled || isPreparing}
          className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPreparing ? (
            <Loader2 className="mb-3 h-8 w-8 animate-spin" />
          ) : (
            <ImagePlus className="mb-3 h-8 w-8" />
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
