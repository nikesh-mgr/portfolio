import { CalendarDays, ExternalLink, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formatIssueDate = (date) => {
  if (!date) {
    return "Date not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
};

const CertificateCard = ({ certificate, onEdit, onDelete }) => {
  const credentialUrl = certificate?.credentialUrl || null;
  const imageUrl = certificate?.image?.url || null;
  const isVisible = certificate?.isVisible ?? true;

  const handleVerify = () => {
    if (!credentialUrl) {
      return;
    }

    /*
     * Opening the URL programmatically avoids the `asChild`
     * pattern and therefore prevents custom props from being
     * forwarded to native DOM elements.
     */
    window.open(credentialUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {imageUrl ? (
        <div className="flex h-52 items-center justify-center overflow-hidden border-b bg-muted/20 p-4">
          <img
            src={imageUrl}
            alt={`${certificate.title} certificate`}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex h-52 items-center justify-center border-b bg-muted/20">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No certificate image
            </p>
          </div>
        </div>
      )}

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 text-lg">
            {certificate.title}
          </CardTitle>

          <Badge
            variant={isVisible ? "default" : "secondary"}
            className="shrink-0"
          >
            {isVisible ? "Visible" : "Hidden"}
          </Badge>
        </div>

        <p className="text-sm font-medium text-muted-foreground">
          {certificate.issuer}
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />

          <span>{formatIssueDate(certificate.issueDate)}</span>
        </div>

        {certificate.credentialId && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Credential ID
            </p>

            <p className="mt-1 break-all text-sm">{certificate.credentialId}</p>
          </div>
        )}

        {certificate.description && (
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {certificate.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap justify-end gap-2 border-t pt-4">
        {credentialUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleVerify}
          >
            <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
            Verify
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit?.(certificate)}
          aria-label={`Edit ${certificate.title}`}
        >
          <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
          Edit
        </Button>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onDelete?.(certificate)}
          aria-label={`Delete ${certificate.title}`}
        >
          <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;
