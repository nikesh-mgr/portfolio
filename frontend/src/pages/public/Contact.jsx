import { useQuery } from "@tanstack/react-query";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { MapPin, Mail } from "lucide-react";

import { getSiteSettings } from "@/api/siteSettingsApi";
import ContactForm from "@/components/contact/ContactForm";

const Contact = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: getSiteSettings,
    staleTime: 5 * 60 * 1000,
  });

  const settings = data?.settings || null;

  const contactEmail = settings?.contactEmail || "";
  const location = settings?.location || "";
  const developerName = settings?.developerName || "";
  const socialLinks = settings?.socialLinks || {};

  const socialItems = [
    {
      name: "GitHub",
      href: socialLinks.github,
      icon: FaGithub,
    },
    {
      name: "LinkedIn",
      href: socialLinks.linkedin,
      icon: FaLinkedin,
    },
    {
      name: "Twitter / X",
      href: socialLinks.twitter,
      icon: FaTwitter,
    },
    {
      name: "Facebook",
      href: socialLinks.facebook,
      icon: FaFacebook,
    },
    {
      name: "Instagram",
      href: socialLinks.instagram,
      icon: FaInstagram,
    },
  ].filter((item) => item.href);

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-primary">Contact</p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Let&apos;s work together
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Have a project, opportunity, or question? Feel free to get in touch.
          </p>
        </div>

        {/* Contact information */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold">Contact information</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {developerName
                ? `You can reach ${developerName} using the information below.`
                : "You can reach me using the information below."}
            </p>

            <div className="mt-8 space-y-5">
              {/* Email */}
              {isLoading ? (
                <div className="h-16 animate-pulse rounded-lg bg-muted" />
              ) : contactEmail ? (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-medium">Email</p>

                    <p className="truncate text-sm text-muted-foreground">
                      {contactEmail}
                    </p>
                  </div>
                </a>
              ) : null}

              {/* Location */}
              {isLoading ? (
                <div className="h-16 animate-pulse rounded-lg bg-muted" />
              ) : location ? (
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-medium">Location</p>

                    <p className="text-sm text-muted-foreground">{location}</p>
                  </div>
                </div>
              ) : null}

              {/* Empty state */}
              {!isLoading && !contactEmail && !location && !isError && (
                <p className="text-sm text-muted-foreground">
                  Contact information has not been configured yet.
                </p>
              )}
            </div>
          </section>

          {/* Social links */}
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold">Connect with me</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Find me on these platforms.
            </p>

            <div className="mt-8 space-y-3">
              {isLoading ? (
                <>
                  <div className="h-12 animate-pulse rounded-lg bg-muted" />
                  <div className="h-12 animate-pulse rounded-lg bg-muted" />
                  <div className="h-12 animate-pulse rounded-lg bg-muted" />
                </>
              ) : socialItems.length > 0 ? (
                socialItems.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Visit ${social.name}`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>

                      <span className="text-sm font-medium">{social.name}</span>
                    </a>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  No social profiles have been added yet.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Contact form */}
        <section className="mx-auto mt-6 max-w-3xl rounded-2xl border bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Send a message</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Fill out the form and I&apos;ll get back to you as soon as possible.
          </p>

          <div className="mt-6">
            <ContactForm />
          </div>
        </section>

        {isError && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Contact information is currently unavailable.
          </p>
        )}
      </section>
    </main>
  );
};

export default Contact;
