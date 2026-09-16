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

      toast.success("Logged out successfully");

      navigate("/auth/login", {
        replace: true,
      });
    } catch {
      toast.error("Unable to logout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen">
        <AdminSidebar admin={admin} onLogout={handleLogout} />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader admin={admin} onLogout={handleLogout} />

          <main className="flex-1">
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
