import { AlertCircle, RefreshCw } from "lucide-react";

const AdminErrorState = ({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
}) => {
  return (
    <div
      className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-destructive/20 bg-card p-8 text-center"
      role="alert"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-5 text-destructive" />
      </div>

      <h2 className="mt-4 text-lg font-semibold tracking-tight">{title}</h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
      )}
    </div>
  );
};

export default AdminErrorState;
