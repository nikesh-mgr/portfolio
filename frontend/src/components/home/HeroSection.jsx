
import { ArrowDown, ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute inset-x-0 top-0 h-px bg-border" />
      </div>

      <div className="container-page relative z-10 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-5xl">
          {/* Availability */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm sm:text-sm">
              <span
                className="size-2 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              Available for opportunities
            </div>
          </motion.div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary sm:text-base">
              Full-Stack Developer
            </p>

            <h1 className="max-w-4xl text-4xl font-bold tracking-[-0.04em] text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              I build digital experiences that{" "}
              <span className="text-muted-foreground">
                solve real problems.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              I'm a developer focused on building reliable, scalable, and
              user-friendly web applications with modern technologies across
              the frontend and backend.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              to="/projects"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              View Projects
              <ArrowRight className="size-4" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Mail className="size-4" />
              Let's Talk
            </Link>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <span className="text-sm text-muted-foreground">
              Find me on
            </span>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FaGithub className="size-4" />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FaLinkedinIn className="size-4" />
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-20 hidden items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:flex"
          >
            <ArrowDown className="size-4" />
            <span>Scroll to explore</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
