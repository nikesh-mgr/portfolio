import {
  Award,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { adminNavigation } from "./adminNavigation";

const AdminMobileNav = ({ admin, onLogout }) => {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger
          type="button"
          aria-label="Open admin navigation"
          className="inline-flex size-10 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="size-5" />
        </SheetTrigger>

        <SheetContent
          side="left"
          className="flex w-[280px] flex-col p-0 sm:w-[320px]"
        >
          <SheetHeader className="border-b px-5 py-5 text-left">
            <SheetTitle className="text-lg">Admin Panel</SheetTitle>

            <SheetDescription>Manage your portfolio content.</SheetDescription>
          </SheetHeader>

          <nav
            className="flex-1 overflow-y-auto px-3 py-4"
            aria-label="Admin navigation"
          >
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

          <div className="border-t p-4">
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {admin?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {admin?.name || "Admin"}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {admin?.email || "Administrator"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminMobileNav;
