import { useMemo, useState } from "react";
import { FileText, RefreshCw, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { getBlogs } from "@/api/blogApi";
import BlogFilters from "@/components/blogs/BlogFilters";
import BlogsGrid from "@/components/blogs/BlogsGrid";

const Blogs = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["blogs", "public"],
    queryFn: getBlogs,
  });

  const blogs = useMemo(() => {
    const blogList = Array.isArray(data?.blogs)
      ? data.blogs
      : Array.isArray(data?.data)
        ? data.data
        : [];

    return blogList
      .filter((blog) => blog.published !== false)
      .sort((first, second) => {
        const firstDate = new Date(
          first.publishedAt || first.createdAt || first.updatedAt || 0,
        );

        const secondDate = new Date(
          second.publishedAt || second.createdAt || second.updatedAt || 0,
        );

        return secondDate - firstDate;
      });
  }, [data]);

  const categories = useMemo(() => {
    const categorySet = new Set();

    blogs.forEach((blog) => {
      if (blog.category) {
        categorySet.add(String(blog.category));
      }
    });

    return Array.from(categorySet).sort((first, second) =>
      first.localeCompare(second),
    );
  }, [blogs]);

  const tags = useMemo(() => {
    const tagSet = new Set();

    blogs.forEach((blog) => {
      if (!Array.isArray(blog.tags)) {
        return;
      }

      blog.tags.forEach((tag) => {
        if (tag) {
          tagSet.add(String(tag));
        }
      });
    });

    return Array.from(tagSet).sort((first, second) =>
      first.localeCompare(second),
    );
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const blogTags = Array.isArray(blog.tags) ? blog.tags : [];

      const searchableContent = [
        blog.title,
        blog.excerpt,
        blog.content,
        blog.category,
        ...blogTags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableContent.includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" ||
        String(blog.category || "").toLowerCase() ===
          selectedCategory.toLowerCase();

      const matchesTag =
        selectedTag === "all" ||
        blogTags.some(
          (tag) => String(tag).toLowerCase() === selectedTag.toLowerCase(),
        );

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [blogs, search, selectedCategory, selectedTag]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedTag("all");
  };

  return (
    <div className="container-page py-16 sm:py-20 lg:py-24">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto mb-10 max-w-3xl"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <FileText className="size-3.5" />
          Blog
        </div>

        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Ideas, lessons &amp; things I've learned.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          Technical articles, development lessons, project insights, and
          practical thoughts from building software.
        </p>
      </motion.header>

      {!isLoading && !isError && blogs.length > 0 && (
        <BlogFilters
          search={search}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          categories={categories}
          tags={tags}
          resultCount={filteredBlogs.length}
          totalCount={blogs.length}
          onSearchChange={setSearch}
          onCategoryChange={setSelectedCategory}
          onTagChange={setSelectedTag}
          onClear={clearFilters}
        />
      )}

      {isLoading && <BlogsGrid blogs={[]} isLoading />}

      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-xl rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"
        >
          <h2 className="text-lg font-semibold">Unable to load articles</h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {error?.response?.data?.message ||
              "Something went wrong while loading the blog."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <RefreshCw
              className={`size-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Try again
          </button>
        </motion.div>
      )}

      {!isLoading && !isError && blogs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card p-10 text-center"
        >
          <FileText className="mx-auto size-10 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-semibold">No articles yet</h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Articles will appear here once they have been published.
          </p>
        </motion.div>
      )}

      {!isLoading &&
        !isError &&
        blogs.length > 0 &&
        filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border bg-card p-10 text-center"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <Search className="size-5 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-xl font-semibold">No matching articles</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Try another search term, category, or topic.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <X className="size-4" />
              Clear filters
            </button>
          </motion.div>
        )}

      {!isLoading && !isError && filteredBlogs.length > 0 && (
        <BlogsGrid blogs={filteredBlogs} />
      )}

      {!isLoading && !isError && blogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-16 rounded-2xl border bg-muted/30 p-8 text-center sm:p-10"
        >
          <h2 className="text-2xl font-semibold tracking-tight">
            Have something to build?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Let's discuss your next project, technical challenge, or product
            idea.
          </p>

          <Link
            to="/contact"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Get in touch
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Blogs;
