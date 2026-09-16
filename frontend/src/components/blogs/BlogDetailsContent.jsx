import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const formatDate = (date) => {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
};

const getImageUrl = (blog) => {
  return blog.featuredImage?.url || blog.featuredImage || blog.image || null;
};

const BlogDetailsContent = ({ blog }) => {
  const imageUrl = getImageUrl(blog);

  const publishedDate = formatDate(
    blog.publishedAt || blog.createdAt || blog.updatedAt,
  );

  const tags = Array.isArray(blog.tags) ? blog.tags : [];

  return (
    <article className="container-page py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" />
            Back to blog
          </Link>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-10"
        >
          {blog.category && (
            <span className="inline-flex rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {blog.category}
            </span>
          )}

          <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              {blog.excerpt}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
            {publishedDate && (
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" />
                {publishedDate}
              </span>
            )}

            {blog.readingTime && (
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4" />
                {blog.readingTime} min read
              </span>
            )}
          </div>

          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.header>

        {imageUrl && (
          <motion.figure
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10 overflow-hidden rounded-2xl border bg-muted sm:mt-12"
          >
            <img
              src={imageUrl}
              alt={blog.title}
              className="h-auto max-h-[600px] w-full object-cover"
            />
          </motion.figure>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 sm:mt-14"
        >
          <div className="prose-custom">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h2: ({ children }) => (
                  <h2 className="mt-12 scroll-mt-24 text-2xl font-bold tracking-tight sm:text-3xl">
                    {children}
                  </h2>
                ),

                h3: ({ children }) => (
                  <h3 className="mt-10 scroll-mt-24 text-xl font-semibold tracking-tight sm:text-2xl">
                    {children}
                  </h3>
                ),

                p: ({ children }) => (
                  <p className="my-6 max-w-[70ch] text-base leading-8 text-muted-foreground sm:text-lg">
                    {children}
                  </p>
                ),

                ul: ({ children }) => (
                  <ul className="my-6 list-disc space-y-2 pl-6 text-base leading-8 text-muted-foreground sm:text-lg">
                    {children}
                  </ul>
                ),

                ol: ({ children }) => (
                  <ol className="my-6 list-decimal space-y-2 pl-6 text-base leading-8 text-muted-foreground sm:text-lg">
                    {children}
                  </ol>
                ),

                li: ({ children }) => <li className="pl-1">{children}</li>,

                blockquote: ({ children }) => (
                  <blockquote className="my-8 border-l-2 pl-5 text-lg italic leading-8 text-muted-foreground sm:text-xl">
                    {children}
                  </blockquote>
                ),

                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    {children}
                  </a>
                ),

                table: ({ children }) => (
                  <div className="my-8 overflow-x-auto rounded-xl border">
                    <table className="w-full min-w-[600px] border-collapse text-sm">
                      {children}
                    </table>
                  </div>
                ),

                th: ({ children }) => (
                  <th className="border-b bg-muted/50 px-4 py-3 text-left font-semibold">
                    {children}
                  </th>
                ),

                td: ({ children }) => (
                  <td className="border-b px-4 py-3 text-muted-foreground">
                    {children}
                  </td>
                ),

                pre: ({ children }) => (
                  <pre className="my-8 overflow-x-auto rounded-xl border bg-muted/50 p-4 text-sm leading-6">
                    {children}
                  </pre>
                ),

                code: ({ className, children, ...props }) => {
                  const isInline = !className;

                  if (isInline) {
                    return (
                      <code
                        {...props}
                        className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <code
                      {...props}
                      className={`${className} font-mono text-sm`}
                    >
                      {children}
                    </code>
                  );
                },

                img: ({ src, alt }) => (
                  <img
                    src={src}
                    alt={alt || ""}
                    loading="lazy"
                    className="my-8 h-auto max-h-[600px] w-full rounded-xl border object-cover"
                  />
                ),
              }}
            >
              {blog.content || ""}
            </ReactMarkdown>
          </div>
        </motion.div>

        {tags.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <p className="mb-3 text-sm font-medium">Topics</p>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/blog"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" />
            More articles
          </Link>
        </div>

        <div className="mt-16 rounded-2xl border bg-muted/30 p-7 text-center sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight">
            Enjoyed the article?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Have a project or technical challenge you'd like to discuss? Let's
            build something useful together.
          </p>

          <Link
            to="/contact"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogDetailsContent;
