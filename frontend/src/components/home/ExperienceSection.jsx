import {
  BriefcaseBusiness,
  CalendarDays,
  CircleCheck,
  RefreshCw,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

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
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["experiences"],
    queryFn: getExperiences,
  });

  const experiences = data?.experiences || data?.data || [];

  const sortedExperiences = [...experiences].sort(
    (first, second) =>
      new Date(second.startDate || 0) - new Date(first.startDate || 0),
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
            <BriefcaseBusiness className="size-3.5 text-primary" />
            Experience
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Where I've applied my skills.
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Professional experience, responsibilities, and the work that has
            shaped how I approach software development.
          </p>
        </motion.div>

        {isLoading && (
          <div className="relative mt-10 space-y-6 before:absolute before:bottom-0 before:left-3.5 before:top-0 before:w-px before:bg-border sm:space-y-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="relative pl-8 sm:pl-12">
                <div className="absolute left-0 top-1 size-7 animate-pulse rounded-full border bg-muted" />

                <div className="animate-pulse rounded-2xl border bg-card p-5 sm:p-7">
                  <div className="h-4 w-28 rounded bg-muted" />
                  <div className="mt-3 h-7 w-52 rounded bg-muted" />
                  <div className="mt-4 h-4 w-36 rounded bg-muted" />
                  <div className="mt-6 h-16 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-background">
              <BriefcaseBusiness className="size-5 text-destructive" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Unable to load experience
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              We couldn't retrieve the experience information right now. Please
              try again.
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

        {!isLoading && !isError && sortedExperiences.length === 0 && (
          <div className="mt-10 rounded-2xl border bg-card p-10 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-muted">
              <BriefcaseBusiness className="size-5 text-muted-foreground" />
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

        {!isLoading && !isError && sortedExperiences.length > 0 && (
          <div className="relative mt-10 space-y-6 before:absolute before:bottom-0 before:left-3.5 before:top-0 before:w-px before:bg-border sm:space-y-8">
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
                  key={
                    experience._id ||
                    experience.id ||
                    `${experience.company}-${experience.position}-${index}`
                  }
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  className="relative pl-8 sm:pl-12"
                >
                  <div className="absolute left-0 top-1 flex size-7 items-center justify-center rounded-full border bg-background">
                    <BriefcaseBusiness className="size-3.5 text-primary" />
                  </div>

                  <div className="rounded-2xl border bg-card p-5 sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        {experience.company && (
                          <p className="text-sm font-medium text-primary">
                            {experience.company}
                          </p>
                        )}

                        {experience.position && (
                          <h3 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                            {experience.position}
                          </h3>
                        )}
                      </div>

                      {experience.current && (
                        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                          <CircleCheck className="size-3.5" />
                          Current
                        </span>
                      )}
                    </div>

                    {dateRange && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4 shrink-0" />
                        <span>{dateRange}</span>
                      </div>
                    )}

                    {experience.description && (
                      <div className="mt-5 border-t pt-5">
                        <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
                          {experience.description}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
