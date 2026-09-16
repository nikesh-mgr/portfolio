import { Search, SlidersHorizontal, X } from "lucide-react";

const BlogFilters = ({
  search,
  selectedCategory,
  selectedTag,
  categories,
  tags,
  resultCount,
  totalCount,
  onSearchChange,
  onCategoryChange,
  onTagChange,
  onClear,
}) => {
  const hasActiveFilters =
    search.trim() || selectedCategory !== "all" || selectedTag !== "all";

  return (
    <section
      className="mb-8 rounded-2xl border bg-card p-4 sm:p-5"
      aria-label="Blog filters"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
        <div>
          <label
            htmlFor="blog-search"
            className="mb-2 block text-sm font-medium"
          >
            Search articles
          </label>

          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <input
              id="blog-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search articles, topics, or technologies..."
              className="h-11 w-full rounded-lg border bg-background pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear article search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="blog-category"
            className="mb-2 block text-sm font-medium"
          >
            Category
          </label>

          <div className="relative">
            <SlidersHorizontal
              className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <select
              id="blog-category"
              value={selectedCategory}
              onChange={(event) => onCategoryChange(event.target.value)}
              className="h-11 w-full appearance-none rounded-lg border bg-background pl-10 pr-8 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="blog-tag" className="mb-2 block text-sm font-medium">
            Topic
          </label>

          <div className="relative">
            <SlidersHorizontal
              className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <select
              id="blog-tag"
              value={selectedTag}
              onChange={(event) => onTagChange(event.target.value)}
              className="h-11 w-full appearance-none rounded-lg border bg-background pl-10 pr-8 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All topics</option>

              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{resultCount}</span> of{" "}
          <span className="font-medium text-foreground">{totalCount}</span>{" "}
          articles
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:self-auto"
          >
            <X className="size-4" />
            Clear filters
          </button>
        )}
      </div>
    </section>
  );
};

export default BlogFilters;
