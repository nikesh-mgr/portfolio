import {
  AlertCircle,
  Download,
  FileText,
  Loader2,
  Mail,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Document, Page, pdfjs } from "react-pdf";

import { getResume } from "@/api/resumeApi";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const Resume = () => {
  const [numPages, setNumPages] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["resume"],
    queryFn: getResume,
  });

  const resume = data?.resume ?? null;

  const resumeUrl = resume?.file?.url ?? null;

  // ---------------------------------------------------------------------------
  // Download PDF
  // ---------------------------------------------------------------------------

  const handleDownload = async () => {
    if (!resumeUrl || isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);

      const response = await fetch(resumeUrl);

      if (!response.ok) {
        throw new Error("Failed to download resume");
      }

      const blob = await response.blob();

      const pdfBlob = new Blob([blob], {
        type: "application/pdf",
      });

      const downloadUrl = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "resume.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (downloadError) {
      console.error("Resume download failed:", downloadError);

      // Fallback: allow the browser to access the original PDF URL.
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // PDF loaded
  // ---------------------------------------------------------------------------

  const handleDocumentLoadSuccess = ({ numPages: totalPages }) => {
    setNumPages(totalPages);
  };

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <section className="min-h-[70vh]">
        <div className="container-page py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-5xl animate-pulse">
            <div className="mx-auto h-6 w-28 rounded-full bg-muted" />

            <div className="mx-auto mt-6 h-12 max-w-2xl rounded bg-muted" />

            <div className="mx-auto mt-4 h-5 max-w-xl rounded bg-muted" />

            <div className="mt-8 flex justify-center gap-3">
              <div className="h-11 w-40 rounded-md bg-muted" />
              <div className="h-11 w-40 rounded-md bg-muted" />
            </div>

            <div className="mx-auto mt-10 h-[70vh] rounded-2xl bg-muted" />
          </div>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // API error
  // ---------------------------------------------------------------------------

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

            {error?.response?.data?.message && (
              <p className="mt-2 text-xs text-muted-foreground">
                {error.response.data.message}
              </p>
            )}

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`size-4 ${isFetching ? "animate-spin" : ""}`}
                />
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

  // ---------------------------------------------------------------------------
  // No resume
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Main
  // ---------------------------------------------------------------------------

  return (
    <div>
      {/* ------------------------------------------------------------------- */}
      {/* Hero                                                               */}
      {/* ------------------------------------------------------------------- */}

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

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* Resume preview                                                     */}
      {/* ------------------------------------------------------------------- */}

      <main>
        <section className="py-10 sm:py-14 lg:py-16">
          <div className="container-page">
            <div className="mx-auto max-w-5xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Resume preview</p>

                  {numPages && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {numPages} {numPages === 1 ? "page" : "pages"}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDownloading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Download className="size-3.5" />
                  )}
                  Download
                </button>
              </div>

              {/* PDF viewer */}

              <div className="overflow-hidden rounded-2xl border bg-muted/30 shadow-sm">
                <div className="max-h-[85vh] overflow-auto p-3 sm:p-5">
                  <div className="mx-auto flex w-fit flex-col items-center">
                    <Document
                      file={resumeUrl}
                      onLoadSuccess={handleDocumentLoadSuccess}
                      loading={
                        <div className="flex min-h-[500px] w-[min(850px,90vw)] items-center justify-center">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="size-5 animate-spin" />
                            Loading resume...
                          </div>
                        </div>
                      }
                      error={
                        <div className="flex min-h-[400px] w-[min(850px,90vw)] items-center justify-center px-6">
                          <div className="max-w-md text-center">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-background">
                              <AlertCircle className="size-5 text-destructive" />
                            </div>

                            <h2 className="mt-4 font-semibold">
                              Preview unavailable
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              The resume could not be displayed in the browser.
                              You can still download the PDF.
                            </p>

                            <button
                              type="button"
                              onClick={handleDownload}
                              disabled={isDownloading}
                              className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isDownloading ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Download className="size-4" />
                              )}
                              Download PDF
                            </button>
                          </div>
                        </div>
                      }
                    >
                      {Array.from(new Array(numPages || 1), (_, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          width={Math.min(
                            850,
                            typeof window !== "undefined"
                              ? window.innerWidth - 48
                              : 850,
                          )}
                          renderTextLayer
                          renderAnnotationLayer
                          className="mb-4 overflow-hidden rounded-sm bg-white shadow-md last:mb-0"
                        />
                      ))}
                    </Document>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                Browse the resume above or download the original PDF using the
                Download PDF button.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Resume;
