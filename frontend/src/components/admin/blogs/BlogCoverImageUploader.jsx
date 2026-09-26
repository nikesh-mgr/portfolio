import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/*
|--------------------------------------------------------------------------
| File Upload Configuration
|--------------------------------------------------------------------------
|
| Keep these restrictions aligned with the backend uploadMiddleware.
|--------------------------------------------------------------------------
*/

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

const BlogCoverImageUploader = ({
  value = null,
  onChange,
  disabled = false,
}) => {
  const inputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [isPreparing, setIsPreparing] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Set Existing Image
  |--------------------------------------------------------------------------
  |
  | The component can receive:
  |
  | 1. Backend image object:
  |    { url, publicId }
  |
  | 2. Plain URL
  |
  | 3. Newly selected image state:
  |    { file, preview, existingUrl, remove }
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let imageUrl = null;

    if (value && typeof value === "object") {
      if (value.preview) {
        imageUrl = value.preview;
      } else if (value.url) {
        imageUrl = value.url;
      }
    }

    if (typeof value === "string" && value) {
      imageUrl = value;
    }

    setPreview(imageUrl);
  }, [value]);

  /*
  |--------------------------------------------------------------------------
  | Cleanup Blob URL
  |--------------------------------------------------------------------------
  |
  | Object URLs created with URL.createObjectURL() must be revoked
  | when they are no longer needed to prevent browser memory leaks.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /*
  |--------------------------------------------------------------------------
  | Select Image
  |--------------------------------------------------------------------------
  */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate MIME type
    |--------------------------------------------------------------------------
    |
    | Do not use file.type.startsWith("image/").
    |
    | The backend accepts only:
    | - image/jpeg
    | - image/png
    | - image/webp
    |--------------------------------------------------------------------------
    */

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed.");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate File Size
    |--------------------------------------------------------------------------
    */

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must not exceed 5 MB.");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    setIsPreparing(true);

    /*
    |--------------------------------------------------------------------------
    | Revoke Previous Blob Preview
    |--------------------------------------------------------------------------
    */

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    /*
    |--------------------------------------------------------------------------
    | Create Temporary Preview
    |--------------------------------------------------------------------------
    */

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);

    /*
    |--------------------------------------------------------------------------
    | Notify Parent
    |--------------------------------------------------------------------------
    |
    | existingUrl is null because the selected file is a new image.
    |
    | remove must also be false because selecting a new image replaces
    | the previous image.
    |--------------------------------------------------------------------------
    */

    onChange?.({
      file,
      preview: objectUrl,
      existingUrl: null,
      remove: false,
    });

    setIsPreparing(false);

    /*
    |--------------------------------------------------------------------------
    | Reset Input
    |--------------------------------------------------------------------------
    |
    | This allows the user to select the same file again later.
    |--------------------------------------------------------------------------
    */

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Remove Image
  |--------------------------------------------------------------------------
  */

  const handleRemove = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);

    /*
    |--------------------------------------------------------------------------
    | Tell the parent that the current image should be removed.
    |--------------------------------------------------------------------------
    |
    | BlogEdit uses:
    |
    | remove === true && !file
    |
    | to call the backend delete-cover-image endpoint.
    |--------------------------------------------------------------------------
    */

    onChange?.({
      file: null,
      preview: null,
      existingUrl: null,
      remove: true,
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Choose Image
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
  | Render
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
