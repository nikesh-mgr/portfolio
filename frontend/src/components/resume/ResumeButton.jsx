import { Download, ExternalLink, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getResume } from "@/api/resumeApi";

const ResumeButton = ({ variant = "primary", showLabel = true }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["resume"],
    queryFn: getResume,
    staleTime: 5 * 60 * 1000,
  });

  const resume = data?.resume || null;
  const resumeUrl = resume?.file?.url || null;

  if (isLoading) {
    return (
      <span
        className={[
          "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium opacity-60",
          variant === "primary"
            ? "bg-primary text-primary-foreground"
            : "bg-background",
        ].join(" ")}
        aria-hidden="true"
      >
        <FileText className="size-4" />

        {showLabel && "Resume"}
      </span>
    );
  }

  if (isError || !resumeUrl) {
    return null;
  }

  if (variant === "outline") {
    return (
      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ExternalLink className="size-4" />

        {showLabel && "View Resume"}
      </a>
    );
  }

  return (
    <a
      href={resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Download className="size-4" />

      {showLabel && "Download Resume"}
    </a>
  );
};

export default ResumeButton;
