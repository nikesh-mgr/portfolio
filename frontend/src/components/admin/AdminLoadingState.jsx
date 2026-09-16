import { LoaderCircle } from "lucide-react";

const AdminLoadingState = ({ message = "Loading..." }) => {
  return (
    <div
      className="flex min-h-60 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="size-6 animate-spin text-primary" />

      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default AdminLoadingState;
