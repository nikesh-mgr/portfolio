import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardStatCard = ({ title, value, description, icon: Icon, href }) => {
  return (
    <div className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/30 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div
          className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </div>

        {href && (
          <Link
            to={href}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            aria-label={`View ${title}`}
          >
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>

        <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>

        {description && (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardStatCard;
