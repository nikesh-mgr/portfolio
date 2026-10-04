import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CircleCheck,
  RefreshCw,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";

import { getExperiences } from "@/api/experienceApi";

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

const ExperienceSection = ({ id = "experience" }) => {
  const shouldReduceMotion = useReducedMotion();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["experiences"],
    queryFn: getExperiences,
  });

  const experiences = data?.experiences ?? [];

  const sortedExperiences = [...experiences].sort(
    (first, second) =>
      new Date(second.startDate || 0) - new Date(first.startDate || 0),
  );

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-20 border-t py-20 sm:py-24 lg:py-28"
    >
      <div className="container-page">
        {/* Section heading */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end"
        >
          <div>
            <div className="inline-flex items-center gap-2 border-b border-primary pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <BriefcaseBusiness aria-hidden="true" className="size-3.5" />
              Experience
            </div>

            <h2
              id={`${id}-heading`}
              className="mt-5 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            >
              Where experience became{" "}
              <span className="text-muted-foreground">capability.</span>
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-muted-foreground lg:justify-self-end lg:text-lg">
            A timeline of roles, responsibilities, and environments that have
            shaped how I build software and solve problems.
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div
            aria-label="Loading experience"
            aria-busy="true"
            className="relative mt-12 space-y-8 pl-7 sm:pl-10"
          >
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-2.5 top-0 w-px bg-border sm:left-3.5"
            />

            {[1, 2, 3].map((item) => (
              <div key={item} className="relative animate-pulse">
                <div
                  aria-hidden="true"
                  className="absolute -left-7 top-5 size-5 rounded-full border-4 border-background bg-muted sm:-left-10 sm:size-7"
                />

                <div className="rounded-2xl border bg-card p-5 sm:p-7">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="mt-4 h-7 w-56 rounded bg-muted" />
                  <div className="mt-4 h-4 w-40 rounded bg-muted" />
                  <div className="mt-7 h-20 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            role="alert"
            className="mt-12 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center sm:p-10"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-background">
              <BriefcaseBusiness
                aria-hidden="true"
                className="size-5 text-destructive"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Unable to load experience
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Experience information is temporarily unavailable. Please try
              again.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && sortedExperiences.length === 0 && (
          <div className="mt-12 rounded-2xl border bg-card p-8 text-center sm:p-10">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-muted">
              <BriefcaseBusiness
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Experience coming soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Professional experience will appear here as the portfolio content
              is updated.
            </p>
          </div>
        )}

        {/* Timeline */}
        {!isLoading && !isError && sortedExperiences.length > 0 && (
          <div className="relative mt-12">
            {/* Timeline rail */}
            <div
              aria-hidden="true"
              className="absolute bottom-4 left-2.5 top-4 w-px bg-border sm:left-3.5"
            />

            <div className="space-y-8 sm:space-y-10">
              {sortedExperiences.map((experience, index) => {
                const startDate = formatDate(experience.startDate);
                const endDate = experience.current
                  ? "Present"
                  : formatDate(experience.endDate);

                const dateRange =
                  startDate && endDate
                    ? `${startDate} — ${endDate}`
                    : startDate || endDate;

                return (
                  <motion.article
                    key={experience._id}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
                    whileInView={
                      shouldReduceMotion ? undefined : { opacity: 1, x: 0 }
                    }
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: shouldReduceMotion ? 0 : index * 0.07,
                      ease: "easeOut",
                    }}
                    className="group relative pl-8 sm:pl-12"
                  >
                    {/* Timeline node */}
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-5 flex size-5 items-center justify-center rounded-full border-2 border-background bg-muted-foreground ring-1 ring-border transition-all duration-300 group-hover:bg-primary group-hover:ring-primary/30 sm:size-7"
                    >
                      <span className="size-1.5 rounded-full bg-background sm:size-2" />
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border bg-card transition-colors duration-300 hover:border-primary/30">
                      {/* Current accent */}
                      {experience.current && (
                        <div
                          aria-hidden="true"
                          className="absolute inset-y-0 left-0 w-0.5 bg-primary"
                        />
                      )}

                      <div className="p-5 sm:p-7 lg:p-8">
                        {/* Top metadata */}
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 items-start gap-4">
                            {experience.companyLogo?.url ? (
                              <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background sm:size-12">
                                <img
                                  src={experience.companyLogo.url}
                                  alt={`${experience.company || "Company"} logo`}
                                  className="size-full object-contain p-1.5"
                                  loading={index === 0 ? "eager" : "lazy"}
                                  decoding="async"
                                />
                              </div>
                            ) : (
                              <div
                                aria-hidden="true"
                                className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-muted/50 sm:size-12"
                              >
                                <BriefcaseBusiness className="size-4 text-muted-foreground" />
                              </div>
                            )}

                            <div className="min-w-0">
                              {experience.company && (
                                <p className="truncate text-sm font-semibold text-primary">
                                  {experience.company}
                                </p>
                              )}

                              {experience.position && (
                                <h3 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                                  {experience.position}
                                </h3>
                              )}
                            </div>
                          </div>

                          {experience.current && (
                            <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                              <CircleCheck
                                aria-hidden="true"
                                className="size-3.5"
                              />
                              Current role
                            </span>
                          )}
                        </div>

                        {/* Date */}
                        {dateRange && (
                          <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
                            <CalendarDays
                              aria-hidden="true"
                              className="size-3.5"
                            />
                            <span>{dateRange}</span>
                          </div>
                        )}

                        {/* Description */}
                        {experience.description && (
                          <div className="mt-6 border-t pt-6">
                            <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
                              {experience.description}
                            </p>
                          </div>
                        )}

                        {/* Subtle visual cue */}
                        <div
                          aria-hidden="true"
                          className="mt-6 flex items-center gap-2 text-xs font-medium text-muted-foreground/60 transition-colors duration-300 group-hover:text-primary/70"
                        >
                          <span className="h-px w-8 bg-border transition-all duration-300 group-hover:w-12 group-hover:bg-primary/40" />
                          <ArrowUpRight className="size-3.5" />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
