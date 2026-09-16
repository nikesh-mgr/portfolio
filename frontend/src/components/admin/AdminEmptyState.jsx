import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const AdminEmptyState = ({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}) => {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Plus className="size-5 text-muted-foreground" />
      </div>

      <h2 className="mt-4 text-lg font-semibold tracking-tight">{title}</h2>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {actionLabel}
        </button>
      )}

      {actionLabel && actionHref && !onAction && (
        <Link
          to={actionHref}
          className="mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default AdminEmptyState;
