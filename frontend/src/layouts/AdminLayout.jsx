import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import AdminHeader from "@/components/dashboard/AdminHeader";
import AdminSidebar from "@/components/dashboard/AdminSidebar";

import useAuth from "@/hooks/useAuth";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("You've been signed out successfully.");

      navigate("/auth/login", {
        replace: true,
      });
    } catch {
      toast.error("We couldn't sign you out. Please try again.");
    }
  };

  return (
    <div className="min-h-dvh bg-muted/30">
      <div className="flex min-h-dvh">
        <AdminSidebar
          admin={admin}
          onLogout={handleLogout}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            admin={admin}
            onLogout={handleLogout}
          />

          <main className="min-w-0 flex-1">
            <div className="container-page py-6 sm:py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;