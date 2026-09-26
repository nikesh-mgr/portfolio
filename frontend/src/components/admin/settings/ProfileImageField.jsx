import { ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react";

const ProfileImageField = ({
  profileImageUrl,
  imagePreview,
  selectedImage,
  fileInputRef,
  isPending,
  onSelect,
  onUpload,
  onCancel,
  onDelete,
}) => {
  const previewUrl = imagePreview || profileImageUrl;

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">Profile image</label>

      <div className="rounded-xl border bg-background p-4">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-medium">
              {profileImageUrl
                ? "Current profile image"
                : "Upload profile image"}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              JPG, PNG, or WebP. Maximum file size: 5 MB.
            </p>

            {selectedImage && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="truncate">{selectedImage.name}</span>

                <span className="shrink-0 text-muted-foreground">
                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onSelect}
              className="hidden"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
              >
                <ImagePlus className="h-4 w-4" />
                {profileImageUrl ? "Choose new image" : "Choose image"}
              </button>

              {selectedImage && (
                <>
                  <button
                    type="button"
                    onClick={onUpload}
                    disabled={isPending}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}

                    {profileImageUrl ? "Update image" : "Upload image"}
                  </button>

                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </>
              )}

              {profileImageUrl && !selectedImage && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isPending}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-destructive/30 px-3 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Remove image
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageField;
