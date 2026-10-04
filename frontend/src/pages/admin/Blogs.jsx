import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, FileText, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import AdminBlogCard from "@/components/admin/blogs/AdminBlogCard";
import AdminBlogTable from "@/components/admin/blogs/AdminBlogTable";
import BlogFilters from "@/components/admin/blogs/BlogFilters";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminBlogs, deleteBlog } from "@/api/blogApi";
import getApiErrorMessage from "@/utils/ApiErrorhandler";

const DEFAULT_FILTERS = {
  search: "",
  published: "all",
  category: "all",
};

const Blogs = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const blogsQuery = useQuery({
    queryKey: ["blogs"],
    queryFn: getAdminBlogs,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlog,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });

      toast.success("Blog deleted successfully.");
      setBlogToDelete(null);
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "The blog could not be deleted. Please try again.",
        ),
      );
    },
  });

  const blogs = useMemo(() => {
    const data = blogsQuery.data;

    return Array.isArray(data?.blogs) ? data.blogs : [];
  }, [blogsQuery.data]);

  const categories = useMemo(() => {
    return [
      ...new Set(blogs.map((blog) => blog?.category?.trim()).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const search = String(filters.search || "")
      .trim()
      .toLowerCase();

    return blogs
      .filter((blog) => {
        if (filters.published === "published") {
          return blog.published === true;
        }

        if (filters.published === "draft") {
          return blog.published === false;
        }

        return true;
      })
      .filter((blog) => {
        if (filters.category === "all") {
          return true;
        }

        return blog.category === filters.category;
      })
      .filter((blog) => {
        if (!search) {
          return true;
        }

        const searchableText = [
          blog.title,
          blog.excerpt,
          blog.content,
          blog.category,
          blog.slug,
          ...(Array.isArray(blog.tags) ? blog.tags : []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(search);
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.updatedAt || a.publishedAt || a.createdAt || 0,
        ).getTime();

        const dateB = new Date(
          b.updatedAt || b.publishedAt || b.createdAt || 0,
        ).getTime();

        return dateB - dateA;
      });
  }, [blogs, filters]);

  const handleDeleteRequest = (blog) => {
    if (!blog?._id || deleteMutation.isPending) {
      return;
    }

    setBlogToDelete(blog);
  };

  const handleDeleteConfirm = () => {
    if (!blogToDelete?._id || deleteMutation.isPending) {
      return;
    }

    deleteMutation.mutate(blogToDelete._id);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleRetry = () => {
    blogsQuery.refetch();
  };

  if (blogsQuery.isPending) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>

          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-40 w-full rounded-xl" />

        <div className="grid gap-5 md:grid-cols-2 lg:hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border bg-card"
            >
              <Skeleton className="aspect-video w-full rounded-none" />

              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block">
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (blogsQuery.isError) {
    return (
      <section
        role="alert"
        className="flex min-h-[360px] items-center justify-center rounded-xl border bg-card p-6"
      >
        <div className="max-w-md space-y-5 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle
              className="size-6 text-destructive"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-lg font-semibold">Unable to load blogs</h1>

            <p className="text-sm leading-6 text-muted-foreground">
              {getApiErrorMessage(
                blogsQuery.error,
                "We couldn't load your blogs. Please try again.",
              )}
            </p>
          </div>

          <Button
            type="button"
            onClick={handleRetry}
            disabled={blogsQuery.isFetching}
          >
            <RefreshCw
              className={`mr-2 size-4 ${
                blogsQuery.isFetching
                  ? "animate-spin motion-reduce:animate-none"
                  : ""
              }`}
              aria-hidden="true"
            />
            Try again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />

            <h1 className="text-2xl font-semibold tracking-tight">Blogs</h1>
          </div>

          <p className="text-sm text-muted-foreground">
            Create, manage, publish, and organize your blog posts.
          </p>
        </div>

        <Link
          to="/admin/blogs/create"
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
        >
          <Plus className="size-4" aria-hidden="true" />
          New Blog
        </Link>
      </header>

      {/* Filters */}
      <BlogFilters
        filters={filters}
        categories={categories}
        onFiltersChange={setFilters}
        onClear={handleClearFilters}
      />

      {/* Result Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredBlogs.length}
          </span>{" "}
          of <span className="font-medium text-foreground">{blogs.length}</span>{" "}
          {blogs.length === 1 ? "blog" : "blogs"}
        </p>

        {blogsQuery.isFetching && (
          <span className="inline-flex items-center gap-2" aria-live="polite">
            <RefreshCw
              className="size-3.5 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
            Updating...
          </span>
        )}
      </div>

      {/* Content */}
      {blogs.length === 0 ? (
        <section className="flex min-h-[320px] items-center justify-center rounded-xl border bg-card p-6">
          <div className="max-w-md space-y-5 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <FileText
                className="size-6 text-muted-foreground"
                aria-hidden="true"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">No blogs yet</h2>

              <p className="text-sm leading-6 text-muted-foreground">
                Create your first blog post to start building your portfolio
                content.
              </p>
            </div>

            <Link
              to="/admin/blogs/create"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Plus className="size-4" aria-hidden="true" />
              Create your first blog
            </Link>
          </div>
        </section>
      ) : filteredBlogs.length === 0 ? (
        <section className="flex min-h-[280px] items-center justify-center rounded-xl border bg-card p-6">
          <div className="max-w-md space-y-4 text-center">
            <h2 className="text-lg font-semibold">No matching blogs</h2>

            <p className="text-sm leading-6 text-muted-foreground">
              No blog posts match the current search and filters.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
            >
              Clear filters
            </Button>
          </div>
        </section>
      ) : (
        <>
          {/* Mobile / Tablet Cards */}
          <div className="grid gap-5 md:grid-cols-2 lg:hidden">
            {filteredBlogs.map((blog) => (
              <AdminBlogCard
                key={blog._id}
                blog={blog}
                onDelete={handleDeleteRequest}
                isDeleting={
                  deleteMutation.isPending &&
                  deleteMutation.variables === blog._id
                }
              />
            ))}
          </div>

          {/* Desktop Table */}
          <AdminBlogTable
            blogs={filteredBlogs}
            onDelete={handleDeleteRequest}
            deletingBlogId={
              deleteMutation.isPending ? deleteMutation.variables : null
            }
          />
        </>
      )}

      {/* Delete Confirmation */}
      <Dialog
        open={Boolean(blogToDelete)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setBlogToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this blog?</DialogTitle>

            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {blogToDelete?.title || "this blog"}
              </span>
              . This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setBlogToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              aria-busy={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <RefreshCw
                    className="mr-2 size-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 size-4" aria-hidden="true" />
                  Delete Blog
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Blogs;
