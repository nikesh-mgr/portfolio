import AdminMobileNav from "./AdminMobileNav";

const getAdminInitial = (name) => {
  if (!name?.trim()) {
    return "A";
  }

  return name.trim().charAt(0).toUpperCase();
};

const AdminHeader = ({ admin, onLogout }) => {
  const adminInitial = getAdminInitial(admin?.name);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <AdminMobileNav admin={admin} onLogout={onLogout} />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight sm:text-base">
            Dashboard
          </p>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Manage your portfolio
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <div className="hidden items-center gap-3 border-l pl-3 sm:flex">
          <div className="text-right">
            <p className="max-w-40 truncate text-sm font-medium">
              {admin?.name || "Administrator"}
            </p>

            <p className="max-w-40 truncate text-xs text-muted-foreground">
              {admin?.email || "Administrator"}
            </p>
          </div>

          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {adminInitial}
          </div>
        </div>

        <div
          className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground sm:hidden"
          aria-hidden="true"
        >
          {adminInitial}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
