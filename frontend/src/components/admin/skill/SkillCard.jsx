import { Code2, Eye, EyeOff, Pencil, Star, Trash2 } from "lucide-react";

const categoryLabels = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  tools: "Tools",
  other: "Other",
};

const SkillCard = ({ skill, onEdit, onDelete }) => {
  return (
    <article className="rounded-xl border bg-card p-5 transition hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
            <Code2 className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold">{skill.name}</h3>

            <p className="text-xs text-muted-foreground">
              {categoryLabels[skill.category] || skill.category}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {skill.featured && (
            <span
              title="Featured"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"
            >
              <Star className="h-4 w-4" />
            </span>
          )}

          <span
            title={skill.isActive ? "Active" : "Inactive"}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"
          >
            {skill.isActive ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Proficiency</span>

          <span className="text-sm font-semibold">{skill.proficiency}%</span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-muted"
          aria-label={`Proficiency ${skill.proficiency}%`}
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${skill.proficiency}%`,
            }}
          />
        </div>
      </div>

      {skill.description && (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {skill.description}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-xs text-muted-foreground">
          Order: {skill.order}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(skill)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-muted"
            aria-label={`Edit ${skill.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(skill)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-destructive transition hover:bg-destructive/10"
            aria-label={`Delete ${skill.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default SkillCard;
