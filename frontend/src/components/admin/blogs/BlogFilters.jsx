import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_FILTERS = {
  search: "",
  published: "all",
  category: "all",
};

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const BlogFilters = ({
  filters = DEFAULT_FILTERS,
  categories = [],
  onFiltersChange,
  onClear,
}) => {
  const currentFilters = {
    ...DEFAULT_FILTERS,
    ...(filters || {}),
  };

  const updateFilter = (name, value) => {
    onFiltersChange?.({
      ...currentFilters,
      [name]: value,
    });
  };

  const hasActiveFilters =
    Boolean(String(currentFilters.search || "").trim()) ||
    currentFilters.published !== "all" ||
    currentFilters.category !== "all";

  return (
    <section
      aria-labelledby="blog-filters-title"
      className="rounded-xl border bg-card p-4 shadow-sm sm:p-5"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50"
            aria-hidden="true"
          >
            <SlidersHorizontal className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h2
                id="blog-filters-title"
                className="text-sm font-semibold tracking-tight"
              >
                Filters
              </h2>

              {hasActiveFilters && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  Active
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Search and filter your blog posts.
            </p>
          </div>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={onClear}
            >
              <X className="size-3.5" aria-hidden="true" />
              <span>Clear</span>
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="space-y-1.5">
          <label
            htmlFor="blog-search-filter"
            className="text-xs font-medium text-muted-foreground"
          >
            Search
          </label>

          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <Input
              id="blog-search-filter"
              type="search"
              value={currentFilters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search by title, content, category, or tags..."
              className="pl-9"
              aria-label="Search blog posts"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Visibility */}
          <div className="space-y-1.5">
            <label
              htmlFor="blog-published-filter"
              className="text-xs font-medium text-muted-foreground"
            >
              Visibility
            </label>

            <select
              id="blog-published-filter"
              value={currentFilters.published}
              onChange={(event) =>
                updateFilter("published", event.target.value)
              }
              className={selectClassName}
            >
              <option value="all">All visibility</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label
              htmlFor="blog-category-filter"
              className="text-xs font-medium text-muted-foreground"
            >
              Category
            </label>

            <select
              id="blog-category-filter"
              value={currentFilters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
              className={selectClassName}
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
      </div>
    </section>
  );
};

export default BlogFilters;
