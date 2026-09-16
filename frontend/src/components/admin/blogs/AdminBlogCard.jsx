import { ExternalLink, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const AdminBlogCard = ({ blog, onDelete, isDeleting = false }) => {
  const blogId = blog?._id || blog?.id;

  const blogSlug = blog?.slug || blogId;

  const imageUrl = blog?.coverImage?.url || null;

  return (
    <article className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-sm">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={blog?.title || "Blog"}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}

        {/* Published */}
        <div className="absolute left-3 top-3">
          {blog?.published ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
              <Eye className="size-3.5" />
              Published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <EyeOff className="size-3.5" />
              Draft
            </span>
          )}
        </div>

        {/* Featured */}
        {blog?.featured && (
          <div className="absolute right-3 top-3">
            <span className="rounded-full border bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          {/* Category */}
          {blog?.category && (
            <span className="text-xs font-medium text-muted-foreground">
              {blog.category}
            </span>
          )}

          {/* Title */}
          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">
            {blog?.title || "Untitled blog"}
          </h3>

          {/* Excerpt */}
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {blog?.excerpt || "No description available."}
          </p>
        </div>

        {/* Tags */}
        {Array.isArray(blog?.tags) && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md border bg-muted/40 px-2 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}

            {blog.tags.length > 4 && (
              <span className="rounded-md border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                +{blog.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t pt-4">
          {/* View */}
          {blog?.slug && (
            <Link
              to={`/blog/${blog.slug}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${blog?.title || "blog"}`}
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink className="size-4" />
            </Link>
          )}

          {/* Edit */}
          {blogId && (
            <Link
              to={`/admin/blogs/${blogId}/edit`}
              aria-label={`Edit ${blog?.title || "blog"}`}
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Pencil className="size-4" />
            </Link>
          )}

          {/* Delete */}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => onDelete?.(blog)}
            disabled={isDeleting || !blogId}
            aria-label={`Delete ${blog?.title || "blog"}`}
          >
            {isDeleting ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default AdminBlogCard;
