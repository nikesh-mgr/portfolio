import { RefreshCw, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { getSkills } from "@/api/skillApi";

const categoryConfig = {
  frontend: {
    title: "Frontend",
    description: "Building responsive and accessible user interfaces.",
  },
  backend: {
    title: "Backend",
    description: "Designing reliable APIs and server-side systems.",
  },
  database: {
    title: "Database",
    description: "Working with structured and scalable data systems.",
  },
  tools: {
    title: "Tools",
    description: "Development tools that support efficient workflows.",
  },
  devops: {
    title: "DevOps",
    description: "Deployment, infrastructure, and development workflows.",
  },
  languages: {
    title: "Languages",
    description: "Programming languages used across my projects.",
  },
  other: {
    title: "Other",
    description: "Additional technologies and technical capabilities.",
  },
};

const normalizeCategory = (category) => {
  if (!category) {
    return "other";
  }

  const normalized = category.toLowerCase().trim();

  if (normalized.includes("front")) {
    return "frontend";
  }

  if (normalized.includes("back")) {
    return "backend";
  }

  if (normalized.includes("database") || normalized.includes("db")) {
    return "database";
  }

  if (
    normalized.includes("devops") ||
    normalized.includes("deployment") ||
    normalized.includes("cloud")
  ) {
    return "devops";
  }

  if (normalized.includes("tool") || normalized.includes("development")) {
    return "tools";
  }

  if (normalized.includes("language") || normalized.includes("programming")) {
    return "languages";
  }

  return "other";
};

const getLevelValue = (level) => {
  if (typeof level === "number") {
    return Math.min(Math.max(level, 0), 100);
  }

  if (!level) {
    return null;
  }

  const normalized = level.toString().toLowerCase().trim();

  const levelMap = {
    beginner: 30,
    basic: 35,
    intermediate: 60,
    proficient: 75,
    advanced: 85,
    expert: 95,
  };

  if (levelMap[normalized]) {
    return levelMap[normalized];
  }

  const numericValue = Number.parseInt(normalized, 10);

  if (!Number.isNaN(numericValue)) {
    return Math.min(Math.max(numericValue, 0), 100);
  }

  return null;
};

const getLevelLabel = (level) => {
  if (!level) {
    return null;
  }

  if (typeof level === "number") {
    return `${level}%`;
  }

  return level;
};

const SkillsSection = ({ id = "skills" }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  const skills = data?.skills || data?.data || [];

  const groupedSkills = skills.reduce((groups, skill) => {
    const category = normalizeCategory(skill.category);

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(skill);

    return groups;
  }, {});

  const orderedCategories = Object.keys(groupedSkills).sort((first, second) => {
    const order = [
      "frontend",
      "backend",
      "database",
      "languages",
      "tools",
      "devops",
      "other",
    ];

    return order.indexOf(first) - order.indexOf(second);
  });

  orderedCategories.forEach((category) => {
    groupedSkills[category].sort((first, second) => {
      const firstOrder = Number(first.order) || 0;
      const secondOrder = Number(second.order) || 0;

      return firstOrder - secondOrder;
    });
  });

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
            <Sparkles className="size-3.5 text-primary" />
            Technical Skills
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Tools I use to turn ideas into software.
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            A practical collection of technologies and tools I use to design,
            build, test, and maintain digital products.
          </p>
        </motion.div>

        {isLoading && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border bg-card p-6"
              >
                <div className="h-5 w-28 rounded bg-muted" />

                <div className="mt-3 h-4 w-48 rounded bg-muted" />

                <div className="mt-7 space-y-5">
                  {[1, 2, 3].map((line) => (
                    <div key={line}>
                      <div className="h-4 w-32 rounded bg-muted" />
                      <div className="mt-2 h-1.5 rounded-full bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-background">
              <Sparkles className="size-5 text-destructive" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Unable to load skills
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              We couldn't retrieve the skills right now. Please try again.
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

        {!isLoading && !isError && skills.length === 0 && (
          <div className="mt-10 rounded-2xl border bg-card p-10 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-muted">
              <Sparkles className="size-5 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">Skills coming soon</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Technical skills will appear here as the portfolio content is
              updated.
            </p>
          </div>
        )}

        {!isLoading && !isError && skills.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {orderedCategories.map((category, categoryIndex) => {
              const config = categoryConfig[category] || categoryConfig.other;

              return (
                <motion.article
                  key={category}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: categoryIndex * 0.06,
                  }}
                  className="rounded-2xl border bg-card p-5 sm:p-6"
                >
                  <h3 className="text-lg font-semibold tracking-tight">
                    {config.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {config.description}
                  </p>

                  <div className="mt-6 space-y-5">
                    {groupedSkills[category].map((skill) => {
                      const levelValue = getLevelValue(skill.level);
                      const levelLabel = getLevelLabel(skill.level);

                      return (
                        <div key={skill._id || skill.id || skill.name}>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium">
                              {skill.name}
                            </span>

                            {levelLabel && (
                              <span className="text-xs text-muted-foreground">
                                {levelLabel}
                              </span>
                            )}
                          </div>

                          {levelValue !== null && (
                            <div
                              className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
                              role="progressbar"
                              aria-label={`${skill.name} proficiency`}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={levelValue}
                            >
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{
                                  width: `${levelValue}%`,
                                }}
                                viewport={{
                                  once: true,
                                }}
                                transition={{
                                  duration: 0.7,
                                  delay: categoryIndex * 0.06,
                                }}
                                className="h-full rounded-full bg-primary"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
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

export default SkillsSection;
