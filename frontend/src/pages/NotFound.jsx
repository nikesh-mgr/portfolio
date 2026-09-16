import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="container-page w-full">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            404 Error
          </p>

          <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">404</h1>

          <h2 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            Page not found
          </h2>

          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            The page you are looking for does not exist or may have been moved
            to another location.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/">
                <Home />
                Go Home
              </Link>
            </Button>

            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
