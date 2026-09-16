import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";

import AdminMobileNav from "./AdminMobileNav";

const AdminHeader = ({ admin, onLogout }) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <AdminMobileNav admin={admin} onLogout={onLogout} />

        <div>
          <p className="text-sm font-semibold tracking-tight sm:text-base">
            Dashboard
          </p>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Manage your portfolio
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>

        <div className="hidden items-center gap-3 border-l pl-3 sm:flex">
          <div className="text-right">
            <p className="text-sm font-medium">
              {admin?.name || "Administrator"}
            </p>

            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>

          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {admin?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
        </div>

        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground sm:hidden">
          {admin?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
