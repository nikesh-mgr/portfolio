import {
  CalendarDays,
  ExternalLink,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from "lucide-react";

const CertificateCard = ({ certificate, onEdit, onDelete }) => {
  const issueDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No date";

  return (
    <article className="group overflow-hidden rounded-xl border bg-card transition hover:shadow-sm">
      <div className="aspect-video overflow-hidden bg-muted/30">
        {certificate.image?.url ? (
          <img
            src={certificate.image.url}
            alt={`${certificate.title} certificate`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No certificate image
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-semibold">{certificate.title}</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {certificate.issuer}
            </p>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              certificate.isVisible
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {certificate.isVisible ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}

            {certificate.isVisible ? "Visible" : "Hidden"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />

          <span>{issueDate}</span>
        </div>

        {certificate.credentialId && (
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="text-xs text-muted-foreground">Credential ID</p>

            <p className="mt-1 truncate text-sm font-medium">
              {certificate.credentialId}
            </p>
          </div>
        )}

        {certificate.description && (
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {certificate.description}
          </p>
        )}

        <div className="flex items-center justify-between border-t pt-4">
          {certificate.credentialUrl ? (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Verify credential
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">
              No verification link
            </span>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(certificate)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-muted"
              aria-label={`Edit ${certificate.title}`}
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(certificate)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-destructive transition hover:bg-destructive/10"
              aria-label={`Delete ${certificate.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CertificateCard;
