import { Briefcase, Plus } from "lucide-react";

import ExperienceCard from "./ExperienceCard";

const ExperienceList = ({ experiences, onAdd, onEdit, onDelete }) => {
  if (!experiences.length) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted">
          <Briefcase className="size-5 text-muted-foreground" />
        </div>

        <h3 className="mt-4 text-base font-semibold">No experience added</h3>

        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Add your professional experience, internships, freelance work, or
          other relevant positions.
        </p>

        <button
          type="button"
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <ExperienceCard
          key={experience._id || experience.id}
          experience={experience}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ExperienceList;
