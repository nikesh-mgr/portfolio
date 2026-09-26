import { ExternalLink, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const AdminBlogTable = ({ blogs = [], onDelete, deletingBlogId = null }) => {
  return (
    <div className="hidden overflow-x-auto rounded-xl border bg-card lg:block">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30 text-left">
            <th className="px-5 py-3 font-medium text-muted-foreground">
              Blog
            </th>

            <th className="px-5 py-3 font-medium text-muted-foreground">
              Category
            </th>

            <th className="px-5 py-3 font-medium text-muted-foreground">
              Status
            </th>

            <th className="px-5 py-3 text-right font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {blogs.map((blog) => {
            const blogId = blog?._id || blog?.id;
            const blogSlug = blog?.slug || null;
            const imageUrl = blog?.coverImage?.url || null;

            const isDeleting = deletingBlogId === blogId;

            return (
              <tr
                key={blogId || blogSlug}
                className="transition-colors hover:bg-muted/30"
              >
                {/* Blog */}
                <td className="max-w-md px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="size-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={blog?.title || "Blog cover"}
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {blog?.title || "Untitled blog"}
                      </p>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {blog?.excerpt || "No description"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-5 py-4">
                  <span className="text-sm text-muted-foreground">
                    {blog?.category || "Uncategorized"}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  {blog?.published ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
                      <Eye className="size-3.5" />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <EyeOff className="size-3.5" />
                      Draft
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    {/* View */}
                    {blogSlug && (
                      <Link
                        to={`/blog/${blogSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${blog?.title || "blog"}`}
                        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                    )}

                    {/* Edit */}
                    {blogId && (
                      <Link
                        to={`/admin/blogs/${blogId}/edit`}
                        aria-label={`Edit ${blog?.title || "blog"}`}
                        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="size-4" />
                      </Link>
                    )}

                    {/* Delete */}
                    {blogId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete?.(blog)}
                        disabled={isDeleting}
                        aria-label={`Delete ${blog?.title || "blog"}`}
                        className="text-muted-foreground hover:bg-muted hover:text-destructive"
                      >
                        {isDeleting ? (
                          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBlogTable;
