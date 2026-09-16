import { ArrowLeft, FileText, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { getBlogBySlug } from "@/api/blogApi";
import BlogDetailsContent from "@/components/blogs/BlogDetailsContent";

const BlogDetails = () => {
  const { slug } = useParams();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => getBlogBySlug(slug),
    enabled: Boolean(slug),
  });

  const blog = data?.blog || data?.data || null;

  if (isLoading) {
    return (
      <div className="container-page py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-5 w-28 rounded bg-muted" />

          <div className="mt-10 h-5 w-24 rounded bg-muted" />

          <div className="mt-5 h-14 w-4/5 rounded bg-muted sm:h-20" />

          <div className="mt-6 h-6 w-3/4 rounded bg-muted" />

          <div className="mt-8 flex gap-4">
            <div className="h-5 w-32 rounded bg-muted" />
            <div className="h-5 w-24 rounded bg-muted" />
          </div>

          <div className="mt-10 aspect-video rounded-2xl bg-muted" />

          <div className="mt-12 space-y-5">
            <div className="h-5 w-full rounded bg-muted" />
            <div className="h-5 w-full rounded bg-muted" />
            <div className="h-5 w-4/5 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl rounded-2xl border bg-card p-8 text-center sm:p-10"
        >
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
            <FileText className="size-5 text-muted-foreground" />
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Article not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {error?.response?.data?.message ||
              "The article you're looking for could not be found."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            {isError && (
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RefreshCw
                  className={`size-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Try again
              </button>
            )}

            <Link
              to="/blog"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-4" />
              Back to blog
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return <BlogDetailsContent blog={blog} />;
};

export default BlogDetails;
