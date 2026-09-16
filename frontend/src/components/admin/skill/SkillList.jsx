import { Code2, Search } from "lucide-react";

import SkillCard from "./SkillCard";

const SkillList = ({ skills, search, onSearchChange, onEdit, onDelete }) => {
  const filteredSkills = skills.filter((skill) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [skill.name, skill.category, skill.description]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  if (skills.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border bg-muted/30">
          <Code2 className="h-5 w-5 text-muted-foreground" />
        </div>

        <h3 className="font-semibold">No skills yet</h3>

        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Add the technologies and tools you use in your development work.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search skills..."
          className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {filteredSkills.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No skills match your search.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill._id}
              skill={skill}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillList;
