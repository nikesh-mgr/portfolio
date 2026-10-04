import { Link } from "react-router-dom";

const AdminPageHeader = ({
  title,
  description,
  action,
  actionLabel,
  actionHref,
  actionIcon: ActionIcon,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action ? (
        <div className="shrink-0">{action}</div>
      ) : (
        actionLabel &&
        actionHref && (
          <Link
            to={actionHref}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ActionIcon && <ActionIcon className="size-4" aria-hidden="true" />}

            {actionLabel}
          </Link>
        )
      )}
    </div>
  );
};

export default AdminPageHeader;
