import { RefreshCw, ShieldAlert } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";

import useAuth from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, authError, checkAuth } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main
        className="flex min-h-dvh items-center justify-center bg-background px-6"
        aria-busy="true"
      >
        <div className="w-full max-w-sm text-center">
          <div
            className="mx-auto flex size-10 items-center justify-center rounded-full border-2 border-muted border-t-primary"
            role="status"
            aria-label="Checking authentication"
          />

          <p className="mt-4 text-sm font-medium">Checking your session</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please wait while we verify your access.
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

          <h1 className="mt-5 text-lg font-semibold">
            We couldn't verify your session
          </h1>

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

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{
          from: `${location.pathname}${location.search}${location.hash}`,
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
