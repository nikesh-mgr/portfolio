import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const formatDate = (date) => {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
};

const BlogCard = ({ blog }) => {
  const imageUrl = blog?.coverImage?.url || null;

  const tags = Array.isArray(blog.tags) ? blog.tags : [];
  const publishedDate = formatDate(
    blog.publishedAt || blog.createdAt || blog.updatedAt,
  );

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card"
    >
      <Link
        to={`/blog/${blog.slug}`}
        aria-label={`Read ${blog.title}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={blog.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-muted-foreground">
                Article preview
              </span>
            </div>
          )}

          {blog.category && (
            <span className="absolute left-4 top-4 rounded-full border bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {blog.category}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex-1">
          <Link
            to={`/blog/${blog.slug}`}
            className="focus-visible:outline-none"
          >
            <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
              {blog.title}
            </h2>
          </Link>

          {blog.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {blog.excerpt}
            </p>
          )}

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 border-t pt-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {publishedDate && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                {publishedDate}
              </span>
            )}

            {blog.readingTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5" />
                {blog.readingTime} min read
              </span>
            )}
          </div>

          <Link
            to={`/blog/${blog.slug}`}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-md text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Read article
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
