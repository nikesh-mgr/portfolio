import { Award, CalendarDays, ExternalLink, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { getCertificates } from "@/api/certificateApi";

const formatDate = (date) => {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const CertificatesSection = ({ id = "certificates" }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["certificates"],
    queryFn: getCertificates,
  });

  const certificates = data?.certificates || data?.data || [];

  const sortedCertificates = [...certificates].sort(
    (first, second) =>
      new Date(second.issueDate || 0) - new Date(first.issueDate || 0),
  );

  return (
    <section id={id} className="scroll-mt-20 py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Award className="size-3.5 text-primary" />
            Certifications
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Continuous learning, backed by credentials.
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Certifications and professional credentials that complement my
            practical experience and demonstrate continued technical growth.
          </p>
        </motion.div>

        {isLoading && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border bg-card p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="size-11 rounded-xl bg-muted" />
                  <div className="size-8 rounded-md bg-muted" />
                </div>

                <div className="mt-6 h-6 w-3/4 rounded bg-muted" />

                <div className="mt-3 h-4 w-1/2 rounded bg-muted" />

                <div className="mt-6 h-4 w-32 rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-background">
              <Award className="size-5 text-destructive" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Unable to load certificates
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              We couldn't retrieve the certificates right now. Please try again.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RefreshCw className="size-4" />
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && sortedCertificates.length === 0 && (
          <div className="mt-10 rounded-2xl border bg-card p-10 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-muted">
              <Award className="size-5 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Certifications coming soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Professional certifications will appear here as the portfolio
              content is updated.
            </p>
          </div>
        )}

        {!isLoading && !isError && sortedCertificates.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sortedCertificates.map((certificate, index) => {
              const issueDate = formatDate(certificate.issueDate);

              return (
                <motion.article
                  key={
                    certificate._id ||
                    certificate.id ||
                    `${certificate.title}-${certificate.issuer}-${index}`
                  }
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.07,
                  }}
                  className="group flex h-full flex-col rounded-2xl border bg-card p-5 transition-colors hover:border-primary/30 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-11 items-center justify-center rounded-xl border bg-muted/40">
                      <Award className="size-5 text-primary" />
                    </div>

                    {certificate.credentialUrl && (
                      <a
                        href={certificate.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${certificate.title} credential`}
                        className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>

                  <div className="mt-6 flex-1">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {certificate.title}
                    </h3>

                    {certificate.issuer && (
                      <p className="mt-2 text-sm font-medium text-primary">
                        {certificate.issuer}
                      </p>
                    )}
                  </div>

                  {issueDate && (
                    <div className="mt-6 flex items-center gap-2 border-t pt-5 text-sm text-muted-foreground">
                      <CalendarDays className="size-4 shrink-0" />
                      <span>Issued {issueDate}</span>
                    </div>
                  )}

                  {certificate.credentialUrl && (
                    <a
                      href={certificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      View credential
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificatesSection;
