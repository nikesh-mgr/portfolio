import { ExternalLink, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const AdminBlogCard = ({ blog, onDelete, isDeleting = false }) => {
  const blogId = blog?._id;
  const blogSlug = blog?.slug;
  const imageUrl = blog?.coverImage?.url || null;
  const title = blog?.title || "Untitled blog";

  return (
    <article
      aria-busy={isDeleting}
      className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-sm"
    >
      {/* Cover image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} cover`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center"
            aria-label="No cover image"
          >
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}

        {/* Publication status */}
        <div className="absolute left-3 top-3">
          {blog?.published ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
              <Eye className="size-3.5" aria-hidden="true" />
              <span>Published</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <EyeOff className="size-3.5" aria-hidden="true" />
              <span>Draft</span>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          {blog?.category && (
            <span className="text-xs font-medium text-muted-foreground">
              {blog.category}
            </span>
          )}

          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">
            {title}
          </h3>

          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {blog?.excerpt || "No description available."}
          </p>
        </div>

        {/* Tags */}
        {Array.isArray(blog?.tags) && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5" aria-label="Blog tags">
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
          {blogSlug && (
            <Link
              to={`/blog/${blogSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${title}`}
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
          )}

          {blogId && (
            <Link
              to={`/admin/blogs/${blogId}/edit`}
              aria-label={`Edit ${title}`}
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Pencil className="size-4" aria-hidden="true" />
            </Link>
          )}

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => onDelete?.(blog)}
            disabled={isDeleting || !blogId}
            aria-label={`Delete ${title}`}
            aria-busy={isDeleting}
          >
            {isDeleting ? (
              <span
                className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              <Trash2 className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default AdminBlogCard;
