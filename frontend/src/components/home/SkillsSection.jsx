import {
  Braces,
  Database,
  GitBranch,
  Layers3,
  RefreshCw,
  Server,
  Wrench,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";

import { getSkills } from "@/api/skillApi";

const categoryConfig = {
  frontend: {
    label: "Frontend",
    description: "Interfaces, interactions, and client-side development.",
    icon: Braces,
  },
  backend: {
    label: "Backend",
    description: "APIs, server-side logic, and application architecture.",
    icon: Server,
  },
  database: {
    label: "Database",
    description: "Data modeling, storage, and persistence.",
    icon: Database,
  },
  devops: {
    label: "DevOps",
    description: "Deployment, infrastructure, and development workflows.",
    icon: GitBranch,
  },
  tools: {
    label: "Tools",
    description: "Tools and platforms used throughout development.",
    icon: Wrench,
  },
  other: {
    label: "Other",
    description: "Additional technologies and supporting capabilities.",
    icon: Layers3,
  },
};

const categoryOrder = [
  "frontend",
  "backend",
  "database",
  "devops",
  "tools",
  "other",
];

const SkillsSection = ({ id = "skills" }) => {
  const shouldReduceMotion = useReducedMotion();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  const skills = data?.skills ?? [];

  const groupedSkills = categoryOrder.reduce((groups, category) => {
    const categorySkills = skills
      .filter((skill) => skill.category === category)
      .sort(
        (first, second) => (second.proficiency ?? 0) - (first.proficiency ?? 0),
      );

    if (categorySkills.length > 0) {
      groups.push({
        category,
        skills: categorySkills,
      });
    }

    return groups;
  }, []);

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
          className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end"
        >
          <div>
            <div className="inline-flex items-center gap-2 border-b border-primary pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Layers3 aria-hidden="true" className="size-3.5" />
              Skills
            </div>

            <h2
              id={`${id}-heading`}
              className="mt-5 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            >
              Tools I use to{" "}
              <span className="text-muted-foreground">build.</span>
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-muted-foreground lg:justify-self-end lg:text-lg">
            A practical overview of the technologies and tools I work with
            across the development lifecycle.
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div
            aria-label="Loading skills"
            aria-busy="true"
            className="mt-12 grid gap-5 md:grid-cols-2"
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border bg-card p-5 sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-muted" />

                  <div>
                    <div className="h-4 w-24 rounded bg-muted" />
                    <div className="mt-2 h-3 w-40 rounded bg-muted" />
                  </div>
                </div>

                <div className="mt-7 space-y-5">
                  {[1, 2, 3].map((skill) => (
                    <div key={skill}>
                      <div className="flex justify-between">
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-4 w-8 rounded bg-muted" />
                      </div>

                      <div className="mt-2 h-1.5 rounded-full bg-muted" />
                    </div>
                  ))}
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
              <Layers3 aria-hidden="true" className="size-5 text-destructive" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Unable to load skills
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Skill information is temporarily unavailable. Please try again.
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
        {!isLoading && !isError && groupedSkills.length === 0 && (
          <div className="mt-12 rounded-2xl border bg-card p-8 text-center sm:p-10">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-muted">
              <Layers3
                aria-hidden="true"
                className="size-5 text-muted-foreground"
              />
            </div>

            <h3 className="mt-4 text-lg font-semibold">Skills coming soon</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Technical skills will appear here as the portfolio content is
              updated.
            </p>
          </div>
        )}

        {/* Skills */}
        {!isLoading && !isError && groupedSkills.length > 0 && (
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {groupedSkills.map(
              ({ category, skills: categorySkills }, index) => {
                const config = categoryConfig[category];

                if (!config) {
                  return null;
                }

                const Icon = config.icon;

                return (
                  <motion.article
                    key={category}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={
                      shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                    }
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: shouldReduceMotion ? 0 : index * 0.07,
                      ease: "easeOut",
                    }}
                    className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-colors duration-300 hover:border-primary/30 sm:p-6"
                  >
                    {/* Category header */}
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-muted/40 transition-colors duration-300 group-hover:border-primary/20 group-hover:bg-primary/5">
                        <Icon
                          aria-hidden="true"
                          className="size-4.5 text-primary"
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold tracking-tight">
                          {config.label}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-7 space-y-5">
                      {categorySkills.map((skill) => {
                        const proficiency = Math.min(
                          100,
                          Math.max(0, Number(skill.proficiency) || 0),
                        );

                        return (
                          <div key={skill._id}>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-sm font-medium">
                                {skill.name}
                              </span>

                              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                {proficiency}%
                              </span>
                            </div>

                            <div
                              className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
                              role="progressbar"
                              aria-label={`${skill.name} proficiency`}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={proficiency}
                            >
                              <motion.div
                                initial={
                                  shouldReduceMotion
                                    ? { width: `${proficiency}%` }
                                    : { width: 0 }
                                }
                                whileInView={{
                                  width: `${proficiency}%`,
                                }}
                                viewport={{
                                  once: true,
                                  amount: 0.5,
                                }}
                                transition={{
                                  duration: shouldReduceMotion ? 0 : 0.8,
                                  delay: shouldReduceMotion ? 0 : 0.15,
                                  ease: "easeOut",
                                }}
                                className="h-full rounded-full bg-primary"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom detail */}
                    <div
                      aria-hidden="true"
                      className="mt-7 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/50"
                    >
                      <span className="h-px w-6 bg-border transition-all duration-300 group-hover:w-10 group-hover:bg-primary/40" />
                      {categorySkills.length}{" "}
                      {categorySkills.length === 1 ? "skill" : "skills"}
                    </div>
                  </motion.article>
                );
              },
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
