import { Search, SlidersHorizontal, X } from "lucide-react";

const ProjectFilters = ({
  search,
  selectedTechnology,
  technologies,
  resultCount,
  totalCount,
  onSearchChange,
  onTechnologyChange,
  onClear,
}) => {
  const hasActiveFilters = search.trim() || selectedTechnology !== "all";

  return (
    <section
      className="mb-8 rounded-2xl border bg-card p-4 sm:p-5"
      aria-label="Project filters"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label
            htmlFor="project-search"
            className="mb-2 block text-sm font-medium"
          >
            Search projects
          </label>

          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <input
              id="project-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by project, technology, or description..."
              className="h-11 w-full rounded-lg border bg-background pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Clear project search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <div className="w-full lg:w-64">
          <label
            htmlFor="technology-filter"
            className="mb-2 block text-sm font-medium"
          >
            Technology
          </label>

          <div className="relative">
            <SlidersHorizontal
              className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <select
              id="technology-filter"
              value={selectedTechnology}
              onChange={(event) => onTechnologyChange(event.target.value)}
              className="h-11 w-full appearance-none rounded-lg border bg-background pl-10 pr-9 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All technologies</option>

              {technologies.map((technology) => (
                <option key={technology} value={technology}>
                  {technology}
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
          projects
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

export default ProjectFilters;
