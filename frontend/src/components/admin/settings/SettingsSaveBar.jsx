import { Check, Loader2, Save } from "lucide-react";

const SettingsSaveBar = ({
  isDirty,
  isPending,
  hasValidationErrors,
  hasSettings,
}) => {
  return (
    <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {isDirty ? (
          <>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Unsaved changes
          </>
        ) : (
          <>
            <Check className="h-4 w-4" />
            All changes saved
          </>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending || hasValidationErrors}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}

        {hasSettings ? "Save changes" : "Create settings"}
      </button>
    </div>
  );
};

export default SettingsSaveBar;
