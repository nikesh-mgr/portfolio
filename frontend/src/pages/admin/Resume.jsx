import { useMemo, useRef, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { deleteResume, getResume, uploadResume } from "@/api/resumeApi";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const Resume = () => {
  const queryClient = useQueryClient();

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("Resume");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["resume"],
    queryFn: getResume,
  });

  const resume = data?.resume || null;

  const selectedFileSize = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`;
  }, [selectedFile]);

  const uploadMutation = useMutation({
    mutationFn: uploadResume,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["resume"],
      });

      setSelectedFile(null);
      setTitle("Resume");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success(response?.message || "Resume uploaded successfully");
    },

    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message || "Failed to upload resume",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResume,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["resume"],
      });

      toast.success(response?.message || "Resume deleted successfully");
    },

    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message || "Failed to delete resume",
      );
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");

      event.target.value = "";

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Resume must be 5 MB or smaller");

      event.target.value = "";

      return;
    }

    setSelectedFile(file);
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a PDF resume");

      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      toast.error("Resume title is required");

      return;
    }

    if (trimmedTitle.length > 100) {
      toast.error("Resume title cannot exceed 100 characters");

      return;
    }

    uploadMutation.mutate({
      file: selectedFile,
      title: trimmedTitle,
    });
  };

  const handleDelete = () => {
    if (!resume) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete the current resume? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(resume._id || resume.id);
  };

  const handleViewResume = () => {
    if (!resume?.file?.url) {
      return;
    }

    window.open(resume.file.url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadResume = () => {
    if (!resume?.file?.url) {
      return;
    }

    window.open(resume.file.url, "_blank", "noopener,noreferrer");
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Resume"
        description="Manage the resume displayed and downloaded from your portfolio."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Current Resume */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Current Resume
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Your currently active resume.
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isFetching}
              aria-label="Refresh resume"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[420px] w-full rounded-lg" />

                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-72" />
                </div>
              </div>
            ) : isError ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/[0.03] px-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>

                <h3 className="font-semibold">Failed to load resume</h3>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong while loading the resume."}
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRefresh}
                  className="mt-4 gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </Button>
              </div>
            ) : !resume ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>

                <h3 className="font-semibold">No resume uploaded</h3>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Upload your latest resume to make it available on your
                  portfolio.
                </p>

                <Button
                  type="button"
                  onClick={handleSelectFile}
                  className="mt-5 gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Choose PDF
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* PDF Preview */}
                <div className="overflow-hidden rounded-lg border bg-muted/20">
                  <iframe
                    src={resume.file?.url}
                    title={resume.title || "Resume preview"}
                    className="h-[520px] w-full"
                  />
                </div>

                {/* Resume Information */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">
                        {resume.title || "Resume"}
                      </h3>

                      {resume.isActive && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {resume.file?.size && (
                        <p>
                          Size: {(resume.file.size / (1024 * 1024)).toFixed(2)}{" "}
                          MB
                        </p>
                      )}

                      <p>
                        Format: {(resume.file?.format || "pdf").toUpperCase()}
                      </p>

                      {resume.createdAt && (
                        <p>
                          Uploaded:{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                          }).format(new Date(resume.createdAt))}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleViewResume}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      View
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDownloadResume}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Open PDF
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="gap-2"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload / Replace */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              {resume ? "Replace Resume" : "Upload Resume"}
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Upload a PDF file up to 5 MB.
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="resumeTitle">Resume title</Label>

              <Input
                id="resumeTitle"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Resume"
                maxLength={100}
                disabled={uploadMutation.isPending}
              />

              <p className="text-xs text-muted-foreground">
                Maximum 100 characters.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Select PDF</Label>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {!selectedFile ? (
                <button
                  type="button"
                  onClick={handleSelectFile}
                  disabled={uploadMutation.isPending}
                  className="flex min-h-[190px] w-full flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 text-center transition-colors hover:bg-muted/40 disabled:pointer-events-none disabled:opacity-50"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <span className="text-sm font-medium">
                    Click to choose your resume
                  </span>

                  <span className="mt-1 text-xs text-muted-foreground">
                    PDF only • Maximum 5 MB
                  </span>
                </button>
              ) : (
                <div className="rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {selectedFile.name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        PDF • {selectedFileSize}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveSelectedFile}
                      disabled={uploadMutation.isPending}
                      aria-label="Remove selected file"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              className="w-full gap-2"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {resume ? "Replace Resume" : "Upload Resume"}
                </>
              )}
            </Button>

            {resume && (
              <p className="text-center text-xs leading-5 text-muted-foreground">
                Uploading a new resume automatically makes the new file active
                and deactivates the previous resume.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resume;
