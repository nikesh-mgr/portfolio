import { ArrowRight, Code2, Database, Layers3, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const strengths = [
  {
    icon: Code2,
    title: "Clean Development",
    description:
      "Writing maintainable, structured, and reusable code with modern development practices.",
  },
  {
    icon: Layers3,
    title: "Full-Stack Thinking",
    description:
      "Understanding both frontend experiences and backend architecture to build complete solutions.",
  },
  {
    icon: Database,
    title: "Reliable Systems",
    description:
      "Designing APIs, databases, authentication, and application logic with reliability in mind.",
  },
  {
    icon: Rocket,
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
  return (
    <section
      id="about"
      className="border-t bg-muted/20 py-20 sm:py-24 lg:py-32"
    >
      <div className="container-page">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            About Me
          </p>

          <h2 className="text-3xl font-bold tracking-[-0.03em] text-balance sm:text-4xl lg:text-5xl">
            Building useful software with purpose.
          </h2>

          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            I enjoy turning ideas and real-world problems into thoughtful
            digital products. My focus is on creating applications that are not
            only visually polished, but also reliable, maintainable, and
            practical to use.
          </p>
        </motion.div>

        {/* Main content */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-20">
          {/* Personal introduction */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-5 text-sm leading-7 text-muted-foreground sm:text-base">
              <p>
                I'm a full-stack developer interested in building modern web
                applications from the interface users interact with to the
                systems that power them behind the scenes.
              </p>

              <p>
                I work with technologies across the JavaScript ecosystem and
                enjoy learning how different parts of a software system fit
                together — from responsive UI and API design to databases,
                authentication, and deployment.
              </p>

              <p>
                My development approach is centered around solving the actual
                problem first, then choosing the right technology and
                architecture to deliver a clean and dependable solution.
              </p>
            </div>

            <Link
              to="/contact"
              className="mt-7 inline-flex h-10 items-center gap-2 rounded-md border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Let's work together
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>

          {/* Strengths */}
          <div className="grid gap-4 sm:grid-cols-2">
            {strengths.map((strength, index) => {
              const Icon = strength.icon;

              return (
                <motion.article
                  key={strength.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                  className="rounded-xl border bg-background p-5 transition-colors hover:border-primary/30 sm:p-6"
                >
                  <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="font-semibold tracking-tight">
                    {strength.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {strength.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mt-16 border-t pt-10 sm:mt-20 sm:pt-12"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold">Technologies I work with</p>

              <p className="mt-1 text-sm text-muted-foreground">
                A practical stack for building modern web applications.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:max-w-2xl lg:justify-end">
              {technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground sm:text-sm"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
