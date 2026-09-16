import {
  Building2,
  ExternalLink,
  MapPin,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const employmentLabels = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  internship: "Internship",
  freelance: "Freelance",
  contract: "Contract",
  "self-employed": "Self-employed",
};

const ExperienceCard = ({ experience, onEdit, onDelete }) => {
  const {
    company,
    position,
    location,
    employmentType,
    startDate,
    endDate,
    current,
    description,
    technologies = [],
    companyLogo,
    companyUrl,
    featured,
  } = experience;

  return (
    <article className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
          {companyLogo?.url ? (
            <img
              src={companyLogo.url}
              alt={`${company} logo`}
              className="size-full object-contain p-2"
            />
          ) : (
            <Building2 className="size-6 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold">{position}</h3>

                {featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <Star className="size-3" />
                    Featured
                  </span>
                )}
              </div>

              <p className="mt-1 font-medium text-muted-foreground">
                {company}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => onEdit(experience)}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
              >
                <Pencil className="size-3.5" />
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete(experience)}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" />
                Delete
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span>{employmentLabels[employmentType] || employmentType}</span>

            <span>
              {formatDate(startDate)} —{" "}
              {current ? "Present" : formatDate(endDate)}
            </span>

            {location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" />
                {location}
              </span>
            )}

            {companyUrl && (
              <a
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Company
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>

          {description && (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}

          {technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {technologies.map((technology, index) => (
                <span
                  key={`${technology}-${index}`}
                  className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium"
                >
                  {technology}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ExperienceCard;
