import { ArrowRight, CalendarDays, Clock3, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { getBlogs } from "@/api/blogApi";

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getBlogId = (blog) => {
  return blog._id || blog.id || blog.slug || blog.title;
};

const getBlogDate = (blog) => {
  return blog.publishedAt || blog.createdAt || blog.updatedAt;
};

const LatestArticles = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blogs", "latest"],
    queryFn: getBlogs,
  });

  const blogs = data?.blogs || data?.data || [];

  const latestBlogs = [...blogs]
    .filter((blog) => blog.published !== false)
    .sort((first, second) => {
      const firstDate = new Date(getBlogDate(first) || 0).getTime();

      const secondDate = new Date(getBlogDate(second) || 0).getTime();

      return secondDate - firstDate;
    })
    .slice(0, 3);

  return (
    <section
      id="articles"
      className="border-t bg-muted/20 py-20 sm:py-24 lg:py-32"
    >
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Articles
            </p>

            <h2 className="text-3xl font-bold tracking-[-0.03em] text-balance sm:text-4xl lg:text-5xl">
              Thoughts, lessons, and things I've learned.
            </h2>

            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Technical articles, development lessons, and practical insights
              from building software and learning along the way.
            </p>
          </motion.div>

          {!isLoading && !isError && latestBlogs.length > 0 && (
            <Link
              to="/blog"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              View all articles
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <ArticleSkeleton key={item} />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="mt-12 rounded-xl border border-destructive/20 bg-destructive/5 p-8">
            <FileText className="size-8 text-muted-foreground" />

            <h3 className="mt-4 font-semibold">Articles couldn't be loaded</h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              There was a problem loading the latest articles. Please try again
              later.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && latestBlogs.length === 0 && (
          <div className="mt-12 rounded-xl border border-dashed p-10 text-center">
            <FileText className="mx-auto size-8 text-muted-foreground" />

            <h3 className="mt-4 font-semibold">Articles are coming soon</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              I'm preparing technical articles and development notes to share
              here.
            </p>
          </div>
        )}

        {/* Articles */}
        {!isLoading && !isError && latestBlogs.length > 0 && (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latestBlogs.map((blog, index) => (
              <ArticleCard key={getBlogId(blog)} blog={blog} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ArticleCard = ({ blog, index }) => {
  const date = getBlogDate(blog);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
      }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-sm"
    >
      {/* Featured image */}
      {blog.featuredImage?.url && (
        <Link
          to={`/blog/${blog.slug}`}
          className="block overflow-hidden border-b"
          aria-label={`Read ${blog.title}`}
        >
          <img
            src={blog.featuredImage.url}
            alt=""
            loading="lazy"
            className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {blog.category && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
              {blog.category}
            </span>
          )}

          {date && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              {formatDate(date)}
            </span>
          )}

          {blog.readingTime && (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" />
              {blog.readingTime} min
            </span>
          )}
        </div>

        {/* Content */}
        <div className="mt-5">
          <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
            <Link
              to={`/blog/${blog.slug}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {blog.title || "Untitled article"}
            </Link>
          </h3>

          {blog.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {blog.excerpt}
            </p>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Read */}
        <div className="mt-auto pt-6">
          <Link
            to={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Read article
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

const ArticleSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="aspect-[16/9] animate-pulse bg-muted" />

      <div className="p-5 sm:p-6">
        <div className="flex gap-3">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
        </div>

        <div className="mt-5 h-6 w-4/5 animate-pulse rounded bg-muted" />

        <div className="mt-3 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        </div>

        <div className="mt-6 h-4 w-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
};

export default LatestArticles;
