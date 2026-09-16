import {
  AlertCircle,
  Download,
  ExternalLink,
  FileText,
  Mail,
  RefreshCw,
} from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { getResume } from "@/api/resumeApi";

const Resume = () => {
  useEffect(() => {
    document.title = "Resume | Portfolio";

    const description =
      "View and download my professional resume, including experience, technical skills, education, and certifications.";

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute("content", description);

    return () => {
      document.title = "Portfolio";
    };
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["resume"],
    queryFn: getResume,
  });

  const resume = data?.resume || data?.data || null;

  const resumeUrl = resume?.url || resume?.fileUrl || null;

  if (isLoading) {
    return (
      <section className="min-h-[70vh]">
        <div className="container-page py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl animate-pulse text-center">
            <div className="mx-auto h-6 w-28 rounded-full bg-muted" />

            <div className="mx-auto mt-6 h-12 max-w-2xl rounded bg-muted" />

            <div className="mx-auto mt-4 h-5 max-w-xl rounded bg-muted" />

            <div className="mt-8 flex justify-center gap-3">
              <div className="h-11 w-36 rounded-md bg-muted" />
              <div className="h-11 w-36 rounded-md bg-muted" />
            </div>

            <div className="mx-auto mt-10 h-[60vh] rounded-2xl bg-muted" />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-[70vh]">
        <div className="container-page py-16 sm:py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center sm:p-10"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-muted">
              <AlertCircle className="size-5 text-destructive" />
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight">
              Resume unavailable
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              We couldn't retrieve the resume right now. Please try again or
              contact me directly.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RefreshCw className="size-4" />
                Try again
              </button>

              <Link
                to="/contact"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mail className="size-4" />
                Contact me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (!resumeUrl) {
    return (
      <section className="min-h-[70vh]">
        <div className="container-page py-16 sm:py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center sm:p-10"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl border bg-muted/40">
              <FileText className="size-5 text-primary" />
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight">
              Resume coming soon
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              My current resume isn't available yet. You can explore my projects
              and professional background in the meantime.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/background"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View background
              </Link>

              <Link
                to="/contact"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mail className="size-4" />
                Contact me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="border-b">
        <div className="container-page py-16 sm:py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <FileText className="size-3.5 text-primary" />
              Resume
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              A concise overview of my professional journey.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Explore my experience, technical skills, education, and
              certifications in one place.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ExternalLink className="size-4" />
                View Resume
              </a>

              <a
                href={resumeUrl}
                download
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Download className="size-4" />
                Download PDF
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <main>
        <section className="py-10 sm:py-14 lg:py-16">
          <div className="container-page">
            <div className="mx-auto max-w-5xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-sm font-medium">Resume preview</p>

                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Open separately
                  <ExternalLink className="size-3.5" />
                </a>
              </div>

              <div className="overflow-hidden rounded-2xl border bg-muted/20 shadow-sm">
                <iframe
                  src={resumeUrl}
                  title="Professional resume preview"
                  loading="lazy"
                  className="h-[70vh] min-h-[600px] w-full sm:h-[80vh]"
                />
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                If the preview doesn't load in your browser, use "Open
                separately" or "Download PDF".
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Resume;
