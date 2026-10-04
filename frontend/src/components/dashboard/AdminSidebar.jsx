import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { adminNavigation } from "./adminNavigation";

const getAdminInitial = (name) => {
  if (!name?.trim()) {
    return "A";
  }

  return name.trim().charAt(0).toUpperCase();
};

const AdminSidebar = ({ admin, onLogout }) => {
  const adminInitial = getAdminInitial(admin?.name);

  return (
    <aside className="hidden h-dvh w-64 shrink-0 flex-col border-r bg-background lg:flex">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <div className="min-w-0">
          <p className="truncate font-semibold tracking-tight">Portfolio CMS</p>

          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4" aria-label="Admin navigation">
        <div className="space-y-1">
          {adminNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  [
                    "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />

                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {adminInitial}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {admin?.name || "Administrator"}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {admin?.email || ""}
            </p>
          </div>
        </div>

        <Separator className="mb-3" />

        <Button
          type="button"
          variant="ghost"
          className="min-h-10 w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
