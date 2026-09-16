import { Award, Search } from "lucide-react";

import CertificateCard from "./CertificateCard";

const CertificateList = ({
  certificates,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}) => {
  const filteredCertificates = certificates.filter((certificate) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [certificate.title, certificate.issuer, certificate.credentialId]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  if (certificates.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border bg-muted/30">
          <Award className="h-5 w-5 text-muted-foreground" />
        </div>

        <h3 className="font-semibold">No certificates yet</h3>

        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Add your certifications, credentials, and professional achievements.
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
          placeholder="Search certificates..."
          className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {filteredCertificates.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No certificates match your search.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCertificates.map((certificate) => (
            <CertificateCard
              key={certificate._id}
              certificate={certificate}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificateList;
