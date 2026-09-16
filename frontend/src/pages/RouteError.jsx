import { Link, useRouteError } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

const RouteError = () => {
  const error = useRouteError();

  const errorMessage =
    error?.statusText ||
    error?.message ||
    "Something went wrong while loading this page.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="container-page w-full">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border bg-muted">
            <AlertTriangle className="size-5" />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Application Error
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Something went wrong
          </h1>

          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            {errorMessage}
          </p>

          <div className="mt-8">
            <Button asChild>
              <Link to="/">
                <Home />
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RouteError;
