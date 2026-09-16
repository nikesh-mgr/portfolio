import { ArrowUpRight } from "lucide-react";

const DashboardStatCard = ({ title, value, description, icon: Icon, href }) => {
  return (
    <div className="rounded-xl border bg-card p-5 transition-colors hover:border-primary/30 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>

        {href && (
          <a
            href={href}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`View ${title}`}
          >
            <ArrowUpRight className="size-4" />
          </a>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>

        <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>

        {description && (
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

export default DashboardStatCard;
