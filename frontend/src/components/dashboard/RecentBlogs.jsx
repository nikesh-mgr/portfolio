import { ArrowUpRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const RecentBlogs = ({ blogs = [] }) => {
  if (blogs.length === 0) {
    return (
      <div className="flex min-h-32 flex-col items-center justify-center px-4 text-center">
        <div
          className="flex size-9 items-center justify-center rounded-lg bg-muted"
          aria-hidden="true"
        >
          <FileText className="size-4 text-muted-foreground" />
        </div>

        <p className="mt-3 text-sm font-medium">No articles yet</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Publish your first technical article.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {blogs.map((blog) => (
        <div
          key={blog._id || blog.id || blog.slug}
          className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {blog.title || "Untitled article"}
            </p>

            <p className="mt-1 truncate text-xs text-muted-foreground">
              {blog.category || "Article"}
            </p>
          </div>

          {blog.slug && (
            <Link
              to={`/blog/${blog.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              aria-label={`View ${blog.title || "article"}`}
            >
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecentBlogs;
