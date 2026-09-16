import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProjectFilters = ({ filters, onFiltersChange, onClear }) => {
  const currentFilters = {
    search: filters?.search ?? "",
    status: filters?.status ?? "all",
    published: filters?.published ?? "all",
    featured: filters?.featured ?? "all",
  };

  const updateFilter = (key, value) => {
    onFiltersChange({
      ...currentFilters,
      [key]: value,
    });
  };

  const hasActiveFilters =
    currentFilters.search.trim() !== "" ||
    currentFilters.status !== "all" ||
    currentFilters.published !== "all" ||
    currentFilters.featured !== "all";

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px_auto]">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={currentFilters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search projects..."
            className="pl-9"
          />
        </div>

        {/* Status */}
        <Select
          value={currentFilters.status}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In progress</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
          </SelectContent>
        </Select>

        {/* Visibility */}
        <Select
          value={currentFilters.published}
          onValueChange={(value) => updateFilter("published", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All visibility</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        {/* Featured */}
        <Select
          value={currentFilters.featured}
          onValueChange={(value) => updateFilter("featured", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Featured" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear */}
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          disabled={!hasActiveFilters}
        >
          <RotateCcw className="size-4" />
          Clear
        </Button>
      </div>
    </div>
  );
};

export default ProjectFilters;
