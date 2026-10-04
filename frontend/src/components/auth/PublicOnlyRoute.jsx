import { RefreshCw, ShieldAlert } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

import { Button } from "@/components/ui/button";

import useAuth from "@/hooks/useAuth";

const PublicOnlyRoute = () => {
  const { isAuthenticated, isLoading, authError, checkAuth } = useAuth();

  if (isLoading) {
    return (
      <main
        className="flex min-h-dvh items-center justify-center bg-background"
        aria-busy="true"
      >
        <div className="text-center">
          <div
            className="mx-auto size-9 animate-spin rounded-full border-2 border-muted border-t-primary"
            role="status"
            aria-label="Checking authentication"
          />

          <p className="mt-4 text-sm text-muted-foreground">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-6">
        <div className="w-full max-w-md text-center">
          <div
            className="mx-auto flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive"
            aria-hidden="true"
          >
            <ShieldAlert className="size-5" />
          </div>

          <h1 className="mt-5 text-lg font-semibold">Session check failed</h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {authError}
          </p>

          <Button type="button" className="mt-6" onClick={checkAuth}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
