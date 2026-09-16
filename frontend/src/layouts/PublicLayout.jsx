import { Outlet } from "react-router-dom";

import Footer from "@/components/navigation/Footer";
import Navbar from "@/components/navigation/Navbar";

const PublicLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
