import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { deleteBlog, getAdminBlogs } from "@/api/blogApi";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import AdminBlogCard from "@/components/admin/blogs/AdminBlogCard";
import AdminBlogTable from "@/components/admin/blogs/AdminBlogTable";
import BlogFilters from "@/components/admin/blogs/BlogFilters";
import { Button } from "@/components/ui/button";

const DEFAULT_FILTERS = {
  search: "",
  published: "all",
  category: "all",
};

const Blogs = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [blogToDelete, setBlogToDelete] = useState(null);

  /*
   * --------------------------------------------------------------------------
   * Get admin blogs
   * --------------------------------------------------------------------------
   *
   * The admin endpoint returns both published blogs and drafts.
   *
   * Do not use getBlogs() here because GET /blogs is intentionally
   * restricted to publicly published blogs.
   */

  const blogsQuery = useQuery({
    queryKey: ["blogs"],
    queryFn: getAdminBlogs,
  });

  /*
   * --------------------------------------------------------------------------
   * Delete blog
   * --------------------------------------------------------------------------
   */

  const deleteMutation = useMutation({
    mutationFn: deleteBlog,

    onSuccess: async () => {
      /*
       * Refresh the admin blog list.
       */

      await queryClient.invalidateQueries({
        queryKey: ["blogs"],
        refetchType: "all",
      });

      /*
       * Refresh public blog queries because deleting a published blog
       * changes the public blog collection.
       */

      await queryClient.invalidateQueries({
        queryKey: ["publishedBlogs"],
        refetchType: "all",
      });

      setBlogToDelete(null);

      toast.success("Blog deleted successfully.");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to delete blog.";

      toast.error(message);
    },
  });

  /*
   * --------------------------------------------------------------------------
   * Extract blogs
   * --------------------------------------------------------------------------
   */

  const blogs = useMemo(() => {
    const data =
      blogsQuery.data?.blogs || blogsQuery.data?.data || blogsQuery.data || [];

    return Array.isArray(data) ? data : [];
  }, [blogsQuery.data]);

  /*
   * --------------------------------------------------------------------------
   * Extract categories
   * --------------------------------------------------------------------------
   *
   * Categories are derived from the admin blog response so the filter
   * remains synchronized with the actual stored blog data.
   */

  const categories = useMemo(() => {
    const categorySet = new Set();

    for (const blog of blogs) {
      const category = blog?.category?.trim();

      if (category) {
        categorySet.add(category);
      }
    }

    return Array.from(categorySet).sort((a, b) => a.localeCompare(b));
  }, [blogs]);

  /*
   * --------------------------------------------------------------------------
   * Filter blogs
   * --------------------------------------------------------------------------
   */

  const filteredBlogs = useMemo(() => {
    const search = String(filters.search || "")
      .trim()
      .toLowerCase();

    const selectedCategory = String(filters.category || "all")
      .trim()
      .toLowerCase();

    const result = blogs.filter((blog) => {
      /*
       * Search across useful blog fields.
       */

      const matchesSearch =
        !search ||
        blog?.title?.toLowerCase().includes(search) ||
        blog?.excerpt?.toLowerCase().includes(search) ||
        blog?.content?.toLowerCase().includes(search) ||
        blog?.category?.toLowerCase().includes(search) ||
        blog?.slug?.toLowerCase().includes(search) ||
        (Array.isArray(blog?.tags) &&
          blog.tags.some((tag) => tag?.toLowerCase().includes(search)));

      /*
       * Published status.
       */

      const matchesPublished =
        filters.published === "all" ||
        (filters.published === "published" && blog?.published === true) ||
        (filters.published === "draft" && blog?.published !== true);

      /*
       * Category.
       */

      const matchesCategory =
        selectedCategory === "all" ||
        blog?.category?.trim().toLowerCase() === selectedCategory;

      return matchesSearch && matchesPublished && matchesCategory;
    });

    /*
     * Sort newest updated blogs first.
     *
     * publishedAt is used when available so recently published
     * content remains naturally ordered, followed by updated/created
     * timestamps.
     */

    return [...result].sort((a, b) => {
      const dateA = new Date(
        a?.updatedAt || a?.publishedAt || a?.createdAt || 0,
      ).getTime();

      const dateB = new Date(
        b?.updatedAt || b?.publishedAt || b?.createdAt || 0,
      ).getTime();

      return dateB - dateA;
    });
  }, [blogs, filters]);

  /*
   * --------------------------------------------------------------------------
   * Delete request
   * --------------------------------------------------------------------------
   */

  const handleDeleteRequest = (blog) => {
    setBlogToDelete(blog);
  };

  /*
   * --------------------------------------------------------------------------
   * Confirm delete
   * --------------------------------------------------------------------------
   */

  const handleDeleteConfirm = () => {
    if (!blogToDelete) {
      return;
    }

    const blogId = blogToDelete._id || blogToDelete.id;

    if (!blogId) {
      toast.error("Unable to identify this blog.");
      return;
    }

    deleteMutation.mutate(blogId);
  };

  /*
   * --------------------------------------------------------------------------
   * Filters
   * --------------------------------------------------------------------------
   */

  const handleFiltersChange = (nextFilters) => {
    setFilters({
      ...DEFAULT_FILTERS,
      ...nextFilters,
    });
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  /*
   * --------------------------------------------------------------------------
   * Active filters
   * --------------------------------------------------------------------------
   */

  const hasActiveFilters =
    Boolean(String(filters.search || "").trim()) ||
    filters.published !== "all" ||
    filters.category !== "all";

  /*
   * --------------------------------------------------------------------------
   * Loading
   * --------------------------------------------------------------------------
   */

  if (blogsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Blogs"
          description="Create and manage the articles published on your portfolio."
          actionLabel="New blog"
          actionHref="/admin/blogs/create"
          actionIcon={Plus}
        />

        <div className="flex min-h-80 items-center justify-center rounded-xl border bg-card">
          <p className="text-sm text-muted-foreground">Loading blogs...</p>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------------------------------------------------
   * Error
   * --------------------------------------------------------------------------
   */

  if (blogsQuery.isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Blogs"
          description="Create and manage the articles published on your portfolio."
          actionLabel="New blog"
          actionHref="/admin/blogs/create"
          actionIcon={Plus}
        />

        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border bg-card px-6 text-center">
          <p className="text-sm font-medium">Unable to load blogs</p>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {blogsQuery.error?.response?.data?.message ||
              "Something went wrong while loading your blogs."}
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => blogsQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------------------------------------------------
   * Page
   * --------------------------------------------------------------------------
   */

  return (
    <div className="space-y-6">
      {/* Header */}

      <AdminPageHeader
        title="Blogs"
        description="Create and manage the articles published on your portfolio."
        actionLabel="New blog"
        actionHref="/admin/blogs/create"
        actionIcon={Plus}
      />

      {/* Filters */}

      <BlogFilters
        filters={filters}
        categories={categories}
        onFiltersChange={handleFiltersChange}
        onClear={handleClearFilters}
      />

      {/* Result count */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredBlogs.length} {filteredBlogs.length === 1 ? "blog" : "blogs"}
          {hasActiveFilters ? " found" : ""}
        </p>
      </div>

      {/* Empty state */}

      {filteredBlogs.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border bg-muted/40">
            <Plus className="size-5 text-muted-foreground" />
          </div>

          <h2 className="mt-4 text-base font-semibold">
            {hasActiveFilters ? "No matching blogs" : "No blogs yet"}
          </h2>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {hasActiveFilters
              ? "Try changing your filters or search terms."
              : "Create your first blog article to start publishing content."}
          </p>

          {hasActiveFilters ? (
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={handleClearFilters}
            >
              Clear filters
            </Button>
          ) : (
            <Link
              to="/admin/blogs/create"
              className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="size-4" />
              Create blog
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop */}

          <AdminBlogTable
            blogs={filteredBlogs}
            onDelete={handleDeleteRequest}
            deletingBlogId={
              deleteMutation.isPending
                ? blogToDelete?._id || blogToDelete?.id
                : null
            }
          />

          {/* Mobile / tablet */}

          <div className="grid gap-4 lg:hidden">
            {filteredBlogs.map((blog) => {
              const blogId = blog?._id || blog?.id || blog?.slug;

              return (
                <AdminBlogCard
                  key={blogId}
                  blog={blog}
                  onDelete={handleDeleteRequest}
                  isDeleting={
                    deleteMutation.isPending &&
                    (blogToDelete?._id || blogToDelete?.id) === blogId
                  }
                />
              );
            })}
          </div>
        </>
      )}

      {/* Delete confirmation */}

      <DeleteConfirmDialog
        open={Boolean(blogToDelete)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setBlogToDelete(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
        title="Delete blog?"
        description={
          blogToDelete
            ? `Are you sure you want to delete "${blogToDelete.title}"? This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete blog"
      />
    </div>
  );
};

export default Blogs;
