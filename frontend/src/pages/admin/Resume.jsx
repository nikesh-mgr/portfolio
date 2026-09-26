import { useRef, useState } from "react";

import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  AlertCircle,
} from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Document, Page, pdfjs } from "react-pdf";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

import {
  deleteResume,
  getResume,
  updateResume,
  uploadResume,
} from "@/api/resumeApi";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (!bytes) {
    return "Unknown size";
  }

  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index === 0 ? 0 : 2,
  )} ${units[index]}`;
};

const getErrorMessage = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback;
};

const Resume = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("Resume");
  const [isDeleting, setIsDeleting] = useState(false);
  const [numPages, setNumPages] = useState(null);

  // ---------------------------------------------------------------------------
  // Fetch resume
  // ---------------------------------------------------------------------------

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["resume"],
    queryFn: getResume,
  });

  const resume = data?.resume ?? null;
  const resumeUrl = resume?.file?.url ?? null;

  // ---------------------------------------------------------------------------
  // Upload
  // ---------------------------------------------------------------------------

  const uploadMutation = useMutation({
    mutationFn: uploadResume,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["resume"],
      });

      setSelectedFile(null);
      setTitle("Resume");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Resume uploaded successfully");
    },

    onError: (mutationError) => {
      toast.error(getErrorMessage(mutationError, "Failed to upload resume"));
    },
  });

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------

  const updateMutation = useMutation({
    mutationFn: ({ id, resumeData }) => updateResume(id, resumeData),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["resume"],
      });

      toast.success("Resume status updated");
    },

    onError: (mutationError) => {
      toast.error(getErrorMessage(mutationError, "Failed to update resume"));
    },
  });

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  const deleteMutation = useMutation({
    mutationFn: deleteResume,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["resume"],
      });

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Resume deleted successfully");
    },

    onError: (mutationError) => {
      toast.error(getErrorMessage(mutationError, "Failed to delete resume"));
    },

    onSettled: () => {
      setIsDeleting(false);
    },
  });

  // ---------------------------------------------------------------------------
  // File selection
  // ---------------------------------------------------------------------------

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");

      event.target.value = "";
      setSelectedFile(null);

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Resume must be smaller than 5 MB");

      event.target.value = "";
      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);
  };

  // ---------------------------------------------------------------------------
  // Upload
  // ---------------------------------------------------------------------------

  const handleUpload = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a PDF resume");
      return;
    }

    uploadMutation.mutate({
      file: selectedFile,
      title: title.trim() || "Resume",
    });
  };

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  const handleDelete = () => {
    if (!resume?._id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    deleteMutation.mutate(resume._id);
  };

  // ---------------------------------------------------------------------------
  // Activate / deactivate
  // ---------------------------------------------------------------------------

  const handleToggleActive = () => {
    if (!resume?._id) {
      return;
    }

    updateMutation.mutate({
      id: resume._id,
      resumeData: {
        isActive: !resume.isActive,
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Download
  // ---------------------------------------------------------------------------

  const handleDownload = async () => {
    if (!resumeUrl) {
      toast.error("Resume PDF is not available");
      return;
    }

    try {
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
    } catch (error) {
      console.error("Resume download failed:", error);
      toast.error("Failed to download resume");
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
      <div className="space-y-6">
        <AdminPageHeader
          title="Resume"
          description="Manage the resume displayed on your portfolio."
        />

        <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading resume...
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Resume"
          description="Manage the resume displayed on your portfolio."
        />

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

            <div className="flex-1">
              <h2 className="font-semibold">Failed to load resume</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {getErrorMessage(
                  error,
                  "Something went wrong while loading the resume.",
                )}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Resume"
        description="Upload and manage the resume displayed on your portfolio."
      />

      {/* Upload */}

      <section className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Upload Resume</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Upload a PDF file up to 5 MB.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-5">
          {/* Title */}

          <div className="space-y-2">
            <label htmlFor="resume-title" className="text-sm font-medium">
              Resume title
            </label>

            <input
              id="resume-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
              placeholder="Resume"
              disabled={uploadMutation.isPending}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* File */}

          <div className="space-y-2">
            <label htmlFor="resume-file" className="text-sm font-medium">
              Resume PDF
            </label>

            <input
              ref={fileInputRef}
              id="resume-file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              disabled={uploadMutation.isPending}
              className="block w-full cursor-pointer rounded-lg border bg-background text-sm file:mr-4 file:border-0 file:bg-muted file:px-4 file:py-2.5 file:text-sm file:font-medium hover:file:bg-muted/80 disabled:cursor-not-allowed"
            />

            <p className="text-xs text-muted-foreground">
              PDF only · Maximum 5 MB
            </p>
          </div>

          {/* Selected file */}

          {selectedFile && (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
                <FileText className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {selectedFile.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>

              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            </div>
          )}

          {/* Upload button */}

          <button
            type="submit"
            disabled={!selectedFile || uploadMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Resume
              </>
            )}
          </button>
        </form>
      </section>

      {/* Current resume */}

      <section className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Current Resume</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Your currently uploaded resume.
              </p>
            </div>

            {resume && (
              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                  resume.isActive
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    resume.isActive ? "bg-green-500" : "bg-muted-foreground"
                  }`}
                />

                {resume.isActive ? "Active" : "Inactive"}
              </div>
            )}
          </div>
        </div>

        {!resume ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FileText className="h-7 w-7 text-muted-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">No resume uploaded</h3>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Upload a PDF resume above.
            </p>
          </div>
        ) : (
          <div className="space-y-6 p-5 sm:p-6">
            {/* Information */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Title</p>

                <p className="mt-1 truncate text-sm font-medium">
                  {resume.title || "Resume"}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Format</p>

                <p className="mt-1 text-sm font-medium uppercase">
                  {resume.file?.format || "PDF"}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Size</p>

                <p className="mt-1 text-sm font-medium">
                  {formatFileSize(resume.file?.size)}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Status</p>

                <p className="mt-1 text-sm font-medium">
                  {resume.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            {/* Actions */}

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {/* ONLY download action */}

              <button
                type="button"
                onClick={handleDownload}
                disabled={!resumeUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </button>

              {/* Activate / deactivate */}

              <button
                type="button"
                onClick={handleToggleActive}
                disabled={updateMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}

                {resume.isActive ? "Deactivate" : "Activate"}
              </button>

              {/* Delete */}

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || deleteMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting || deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>
            </div>

            {/* PDF Preview */}

            <div className="overflow-hidden rounded-xl border bg-muted/20">
              <div className="flex items-center justify-between border-b bg-background px-4 py-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />

                  <span className="text-sm font-medium">Resume Preview</span>
                </div>

                {numPages && (
                  <span className="text-xs text-muted-foreground">
                    {numPages} {numPages === 1 ? "page" : "pages"}
                  </span>
                )}
              </div>

              <div className="max-h-[800px] overflow-auto bg-muted/30 p-4">
                <div className="mx-auto flex w-fit flex-col items-center gap-4">
                  <Document
                    file={resumeUrl}
                    onLoadSuccess={handleDocumentLoadSuccess}
                    loading={
                      <div className="flex h-[300px] w-[min(700px,90vw)] items-center justify-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Loading PDF...
                        </div>
                      </div>
                    }
                    error={
                      <div className="flex min-h-[300px] w-[min(700px,90vw)] items-center justify-center">
                        <div className="text-center">
                          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />

                          <p className="mt-3 text-sm font-medium">
                            Failed to load PDF preview
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Use the Download Resume button to access the PDF.
                          </p>
                        </div>
                      </div>
                    }
                  >
                    {Array.from(new Array(numPages || 1), (_, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        renderTextLayer
                        renderAnnotationLayer
                        className="mb-4 shadow-md"
                      />
                    ))}
                  </Document>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Resume;
