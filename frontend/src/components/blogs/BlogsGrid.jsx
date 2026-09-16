import { motion } from "framer-motion";

import BlogCard from "./BlogCard";

const BlogSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="aspect-[16/9] animate-pulse bg-muted" />

      <div className="space-y-4 p-5 sm:p-6">
        <div className="h-6 w-3/4 animate-pulse rounded-md bg-muted" />

        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="flex gap-2">
          <div className="h-7 w-16 animate-pulse rounded-md bg-muted" />
          <div className="h-7 w-20 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="border-t pt-5">
          <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
};

const BlogsGrid = ({ blogs = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <BlogSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.07,
          },
        },
      }}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {blogs.map((blog) => (
        <motion.div
          key={blog._id || blog.id || blog.slug}
          variants={{
            hidden: {
              opacity: 0,
              y: 16,
            },
            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          transition={{ duration: 0.35 }}
        >
          <BlogCard blog={blog} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BlogsGrid;
