import {
  Award,
  ArrowDown,
  BriefcaseBusiness,

  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const backgroundNavigation = [
  {
    label: "Experience",
    href: "#experience",
    icon: BriefcaseBusiness,
  },
  {
    label: "Certificates",
    href: "#certificates",
    icon: Award,
  },
  {
    label: "Skills",
    href: "#skills",
    icon: Sparkles,
  },
];

const BackgroundHero = () => {
  return (
    <section className="border-b">
      <div className="container-page py-16 sm:py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Professional Background
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            The experience, skills, and knowledge behind my work.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            A closer look at my professional journey, technical skills,
            education, and certifications that shape how I approach software
            development.
          </p>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
          aria-label="Background sections"
        >
          {backgroundNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.href}
                href={item.href}
                className="group rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="size-5 text-primary transition-transform group-hover:-translate-y-0.5" />

                <span className="mt-3 block text-sm font-medium">
                  {item.label}
                </span>
              </a>
            );
          })}
        </motion.nav>

        <a
          href="#experience"
          aria-label="Scroll to experience"
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Explore background
          <ArrowDown className="size-4" />
        </a>
      </div>
    </section>
  );
};

export default BackgroundHero;
