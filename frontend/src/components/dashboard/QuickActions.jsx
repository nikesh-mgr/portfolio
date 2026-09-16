import { BriefcaseBusiness, FileText, Settings, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Add project",
    description: "Showcase a new project",
    href: "/admin/projects/create",
    icon: BriefcaseBusiness,
  },
  {
    title: "Write article",
    description: "Publish technical content",
    href: "/admin/blogs/create",
    icon: FileText,
  },
  {
    title: "Edit experience",
    description: "Update your career history",
    href: "/admin/experience",
    icon: UserRound,
  },
  {
    title: "Site settings",
    description: "Manage portfolio information",
    href: "/admin/settings",
    icon: Settings,
  },
];

const QuickActions = () => {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.href}
            to={action.href}
            className="group rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:text-primary">
                <Icon className="size-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">{action.title}</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;
