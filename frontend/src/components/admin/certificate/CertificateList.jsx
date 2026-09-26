import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import CertificateCard from "./CertificateCard";
import { Input } from "@/components/ui/input";

const CertificateList = ({ certificates = [], onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCertificates = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return certificates;
    }

    return certificates.filter((certificate) => {
      const title = certificate.title?.toLowerCase() || "";
      const issuer = certificate.issuer?.toLowerCase() || "";
      const credentialId = certificate.credentialId?.toLowerCase() || "";

      return (
        title.includes(normalizedQuery) ||
        issuer.includes(normalizedQuery) ||
        credentialId.includes(normalizedQuery)
      );
    });
  }, [certificates, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />

        <Input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search certificates..."
          aria-label="Search certificates"
          className="pl-9"
        />
      </div>

      {/* No Certificates */}
      {certificates.length === 0 ? (
        <div className="flex min-h-56 items-center justify-center rounded-xl border bg-card p-6 text-center">
          <div>
            <p className="font-medium">No certificates yet</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Add your first certificate to display it here.
            </p>
          </div>
        </div>
      ) : filteredCertificates.length === 0 ? (
        /* No Search Results */
        <div className="flex min-h-56 items-center justify-center rounded-xl border bg-card p-6 text-center">
          <div>
            <p className="font-medium">No certificates found</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Try a different title, issuer, or credential ID.
            </p>
          </div>
        </div>
      ) : (
        /* Certificate Grid */
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
