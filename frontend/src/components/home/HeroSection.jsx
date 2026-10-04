import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, ExternalLink, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const HeroSection = ({ settings, isLoading = false }) => {
  const shouldReduceMotion = useReducedMotion();

  const developerName =
    settings?.developerName?.trim() || "Full-Stack Developer";

  const tagline =
    settings?.tagline?.trim() ||
    "I build digital experiences that solve real problems.";

  const bio =
    settings?.bio?.trim() ||
    "I build reliable, scalable, and user-friendly web applications across the frontend and backend.";

  const profileImageUrl = settings?.profileImage?.url || null;

  const githubUrl = settings?.socialLinks?.github || null;
  const linkedinUrl = settings?.socialLinks?.linkedin || null;

  const motionTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: "easeOut" };

  const staggerTransition = (delay) =>
    shouldReduceMotion
      ? { duration: 0 }
      : {
          duration: 0.55,
          delay,
          ease: "easeOut",
        };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b"
    >
      {/* Background system */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Top border */}
        <div className="absolute inset-x-0 top-0 h-px bg-border" />

        {/* Soft ambient glow */}
        <div className="absolute -left-40 top-10 size-80 rounded-full bg-primary/[0.06] blur-3xl sm:size-[28rem]" />

        <div className="absolute -right-40 bottom-0 size-80 rounded-full bg-primary/[0.045] blur-3xl sm:size-[30rem]" />

        {/* Technical grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container-page relative z-10">
        <div className="grid min-h-[calc(100dvh-4rem)] items-center gap-12 py-14 sm:gap-14 sm:py-16 md:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:gap-16 lg:py-24 xl:grid-cols-[minmax(0,1fr)_minmax(400px,0.8fr)] xl:gap-24">
          {/* ------------------------------------------------------------ */}
          {/* VISUAL / PROFILE */}
          {/* ------------------------------------------------------------ */}

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    scale: 0.97,
                    y: 12,
                  }
            }
            animate={
              shouldReduceMotion
                ? {}
                : {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }
            }
            transition={motionTransition}
            className="order-first flex justify-center lg:order-last lg:justify-end"
          >
            <div className="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[410px]">
              {/* Decorative coordinates */}
              <div
                aria-hidden="true"
                className="absolute -left-3 top-8 hidden text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60 sm:block"
              >
                01 / 01
              </div>

              <div
                aria-hidden="true"
                className="absolute -right-3 bottom-10 hidden text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60 sm:block"
              >
                DEV
              </div>

              {/* Offset frame */}
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[2rem] border border-primary/10"
              />

              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[2.5rem] border border-border/40"
              />

              {/* Main portrait frame */}
              <div className="relative overflow-hidden rounded-[1.75rem] border bg-muted/30 p-2 shadow-2xl shadow-black/5">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-muted">
                  {isLoading ? (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 animate-pulse bg-muted"
                    />
                  ) : profileImageUrl ? (
                    <motion.img
                      src={profileImageUrl}
                      alt={`Portrait of ${developerName}`}
                      initial={
                        shouldReduceMotion
                          ? false
                          : {
                              scale: 1.04,
                            }
                      }
                      animate={
                        shouldReduceMotion
                          ? {}
                          : {
                              scale: 1,
                            }
                      }
                      transition={{
                        duration: 0.9,
                        ease: "easeOut",
                      }}
                      className="size-full object-cover"
                      fetchPriority="high"
                      decoding="async"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center p-8 text-center">
                      <div>
                        <div
                          aria-hidden="true"
                          className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border bg-background"
                        >
                          <span className="text-xl font-bold text-primary">
                            {"</>"}
                          </span>
                        </div>

                        <p className="text-sm font-medium text-foreground">
                          {developerName}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Full-Stack Developer
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Image overlay */}
                  {profileImageUrl && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent"
                    />
                  )}

                  {/* Bottom image label */}
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                    <div className="rounded-lg border border-white/20 bg-background/80 px-3 py-2 shadow-sm backdrop-blur-md">
                      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Developer
                      </p>

                      <p className="mt-0.5 text-xs font-semibold">
                        {developerName}
                      </p>
                    </div>

                    <div
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-background/80 backdrop-blur-md"
                    >
                      <span className="text-xs font-semibold text-primary">
                        ↗
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating status card */}
              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 10,
                      }
                }
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        opacity: 1,
                        y: 0,
                      }
                }
                transition={staggerTransition(0.45)}
                className="absolute -bottom-5 -left-3 rounded-xl border bg-background/95 px-3 py-2.5 shadow-lg shadow-black/5 backdrop-blur sm:-left-6"
              >
                <div className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/50" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                  </span>

                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Status
                    </p>

                    <p className="text-xs font-semibold">
                      Available for opportunities
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* CONTENT */}
          {/* ------------------------------------------------------------ */}

          <div className="order-last min-w-0 lg:order-first">
            {/* Availability */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 12,
                    }
              }
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              transition={motionTransition}
              className="mb-6"
            >
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm sm:text-sm">
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full bg-emerald-500"
                />

                <span className="truncate">Available for opportunities</span>
              </div>
            </motion.div>

            {/* Eyebrow */}
            <motion.p
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 12,
                    }
              }
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              transition={staggerTransition(0.08)}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm"
            >
              Computer Engineering · Full-Stack Developer
            </motion.p>

            {/* Heading */}
            <motion.h1
              id="hero-heading"
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 18,
                    }
              }
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              transition={staggerTransition(0.14)}
              className="max-w-3xl text-[2.65rem] font-bold leading-[1.02] tracking-[-0.045em] text-balance sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem]"
            >
              {tagline}
            </motion.h1>

            {/* Bio */}
            <motion.p
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 16,
                    }
              }
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              transition={staggerTransition(0.22)}
              className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:text-lg"
            >
              {bio}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 14,
                    }
              }
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              transition={staggerTransition(0.3)}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/projects"
                className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
              >
                View Projects
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                to="/contact"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border bg-background px-5 text-sm font-semibold shadow-sm transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
              >
                <Mail aria-hidden="true" className="size-4" />
                Let's Talk
              </Link>
            </motion.div>

            {/* Social links */}
            {(githubUrl || linkedinUrl) && (
              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                      }
                }
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        opacity: 1,
                      }
                }
                transition={staggerTransition(0.4)}
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                <span className="mr-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Connect
                </span>

                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit ${developerName}'s GitHub profile`}
                    className="inline-flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <FaGithub aria-hidden="true" className="size-4" />
                  </a>
                )}

                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit ${developerName}'s LinkedIn profile`}
                    className="inline-flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <FaLinkedinIn aria-hidden="true" className="size-4" />
                  </a>
                )}

                {settings?.location && (
                  <>
                    <span
                      aria-hidden="true"
                      className="hidden h-px w-12 bg-border sm:block"
                    />

                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {settings.location}
                    </span>
                  </>
                )}
              </motion.div>
            )}

            {/* Scroll cue */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                    }
              }
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      opacity: 1,
                    }
              }
              transition={staggerTransition(0.6)}
              className="mt-12 hidden items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground md:flex"
            >
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-full border"
              >
                <ArrowDown className="size-3.5" />
              </span>

              <span>Scroll to explore</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
