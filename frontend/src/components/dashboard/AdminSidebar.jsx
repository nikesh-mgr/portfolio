import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { adminNavigation } from "./adminNavigation";

const AdminSidebar = ({ admin, onLogout }) => {
  return (
    <aside className="hidden h-dvh w-64 shrink-0 flex-col border-r bg-background lg:flex">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <div>
          <p className="font-semibold tracking-tight">Portfolio CMS</p>

          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {adminNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {admin?.name?.charAt(0)?.toUpperCase() || "A"}
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
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
