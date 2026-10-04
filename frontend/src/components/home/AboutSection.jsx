import { ArrowRight, Code2, Database, Layers3, Rocket } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

const strengths = [
  {
    icon: Code2,
    number: "01",
    title: "Clean Development",
    description:
      "Writing maintainable, structured, and reusable code with modern development practices.",
  },
  {
    icon: Layers3,
    number: "02",
    title: "Full-Stack Thinking",
    description:
      "Understanding both frontend experiences and backend architecture to build complete solutions.",
  },
  {
    icon: Database,
    number: "03",
    title: "Reliable Systems",
    description:
      "Designing APIs, databases, authentication, and application logic with reliability in mind.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Problem Solving",
    description:
      "Turning real-world requirements into practical, scalable, and user-focused digital products.",
  },
];

const technologies = [
  "React",
  "JavaScript",
  "Node.js",
  "Express",
  "MongoDB",
  "REST APIs",
  "Git",
  "Tailwind CSS",
];

const AboutSection = () => {
  const shouldReduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: shouldReduceMotion
      ? false
      : {
          opacity: 0,
          y: 24,
        },
    whileInView: {
      opacity: 1,
      y: 0,
    },
    viewport: {
      once: true,
      amount: 0.15,
    },
    transition: shouldReduceMotion
      ? { duration: 0 }
      : {
          duration: 0.55,
          delay,
          ease: "easeOut",
        },
  });

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden border-t bg-muted/20 py-20 sm:py-24 lg:py-32"
    >
      {/* Subtle section decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/[0.045] blur-3xl"
      />

      <div className="container-page relative">
        {/* ------------------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------------------ */}

        <motion.div {...reveal()} className="max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary sm:w-10" />

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
              About Me
            </p>
          </div>

          <h2
            id="about-heading"
            className="max-w-2xl text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl"
          >
            Building useful software with purpose.
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:text-lg">
            I enjoy turning ideas and real-world problems into thoughtful
            digital products. My focus is on creating applications that are not
            only visually polished, but also reliable, maintainable, and
            practical to use.
          </p>
        </motion.div>

        {/* ------------------------------------------------------------ */}
        {/* INTRO + STRENGTHS */}
        {/* ------------------------------------------------------------ */}

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 xl:gap-24">
          {/* Introduction */}
          <motion.div {...reveal(0.05)} className="min-w-0">
            <div className="relative border-l-2 border-primary/20 pl-5 sm:pl-6">
              <div className="absolute -left-[5px] top-0 size-2 rounded-full bg-primary" />

              <p className="text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                I'm a full-stack developer interested in building modern web
                applications from the interface users interact with to the
                systems that power them behind the scenes.
              </p>

              <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                I work with technologies across the JavaScript ecosystem and
                enjoy learning how different parts of a software system fit
                together — from responsive UI and API design to databases,
                authentication, and deployment.
              </p>

              <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                My development approach is centered around solving the actual
                problem first, then choosing the right technology and
                architecture to deliver a clean and dependable solution.
              </p>
            </div>

            <Link
              to="/contact"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-md border bg-background px-4 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Let's work together
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          {/* Strength cards */}
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {strengths.map((strength, index) => {
              const Icon = strength.icon;

              return (
                <motion.article
                  key={strength.title}
                  {...reveal(0.08 + index * 0.07)}
                  className="group relative overflow-hidden rounded-2xl border bg-background p-5 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-black/[0.04] sm:p-6"
                >
                  {/* Card number */}
                  <div className="absolute right-5 top-5 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground/50">
                    {strength.number}
                  </div>

                  {/* Accent */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                  />

                  {/* Icon */}
                  <div className="mb-7 flex size-11 items-center justify-center rounded-xl border bg-muted/40 text-primary transition-colors duration-200 group-hover:border-primary/20 group-hover:bg-primary/10">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>

                  <h3 className="pr-10 text-base font-semibold tracking-tight sm:text-lg">
                    {strength.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {strength.description}
                  </p>

                  {/* Bottom indicator */}
                  <div
                    aria-hidden="true"
                    className="mt-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60"
                  >
                    <span className="h-px w-5 bg-border transition-all duration-300 group-hover:w-8 group-hover:bg-primary/50" />
                    Core strength
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* TECHNOLOGIES */}
        {/* ------------------------------------------------------------ */}

        <motion.div
          {...reveal(0.1)}
          className="mt-16 border-t pt-10 sm:mt-20 sm:pt-12"
        >
          <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-12">
            {/* Label */}
            <div>
              <p className="text-sm font-semibold">Technologies I work with</p>

              <p className="mt-1.5 max-w-xs text-sm leading-6 text-muted-foreground">
                A practical stack for building modern web applications.
              </p>
            </div>

            {/* Technology list */}
            <div className="flex flex-wrap gap-2">
              {technologies.map((technology, index) => (
                <motion.span
                  key={technology}
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          scale: 0.96,
                        }
                  }
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.3,
                          delay: index * 0.035,
                        }
                  }
                  className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:text-foreground sm:px-3.5 sm:py-2 sm:text-sm"
                >
                  {technology}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
