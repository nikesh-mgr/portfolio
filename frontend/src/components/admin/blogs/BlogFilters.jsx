import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_FILTERS = {
  search: "",
  published: "all",
  category: "all",
};

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
    <div className="rounded-xl border bg-card p-4">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />

          <div>
            <h2 className="text-sm font-medium">Filters</h2>

            <p className="text-xs text-muted-foreground">
              Search and filter your blog posts.
            </p>
          </div>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto gap-1.5"
              onClick={onClear}
            >
              <X className="size-3.5" />
              Clear
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            value={currentFilters.search || ""}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search blogs..."
            className="pl-9"
            aria-label="Search blogs"
          />
        </div>

        {/* Filters */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Published */}
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
    </div>
  );
};

export default BlogFilters;
