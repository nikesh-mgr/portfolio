import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

const AdvancedSettings = ({
  formData,
  updateField,
  settings,
  deleteMutation,
  onDelete,
}) => {
  return (
    <>
      <section className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <h2 className="font-semibold">Maintenance mode</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Temporarily indicate that your portfolio is unavailable.
          </p>
        </div>

        <div className="p-5">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
            <input
              type="checkbox"
              checked={formData.isMaintenanceMode}
              onChange={(event) =>
                updateField("isMaintenanceMode", event.target.checked)
              }
              className="mt-1 h-4 w-4 rounded"
            />

            <span>
              <span className="block text-sm font-medium">
                Enable maintenance mode
              </span>

              <span className="mt-1 block text-sm text-muted-foreground">
                Enable this when the public portfolio is temporarily
                unavailable.
              </span>
            </span>
          </label>

          {formData.isMaintenanceMode && (
            <div className="mt-4 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <p className="text-sm">
                Maintenance mode is enabled. Make sure your frontend handles
                this setting before relying on it in production.
              </p>
            </div>
          )}
        </div>
      </section>

      {settings && (
        <section className="rounded-xl border border-destructive/30 bg-destructive/5">
          <div className="border-b border-destructive/20 p-5">
            <h2 className="font-semibold text-destructive">Danger zone</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Permanently remove the current site settings document.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Delete site settings</p>

              <p className="mt-1 text-sm text-muted-foreground">
                You can create the settings again afterward.
              </p>
            </div>

            <button
              type="button"
              onClick={onDelete}
              disabled={deleteMutation.isPending}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-destructive/40 px-4 text-sm font-medium text-destructive transition hover:bg-destructive hover:text-destructive-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete settings
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default AdvancedSettings;
