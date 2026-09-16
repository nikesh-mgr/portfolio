import { ArrowUpRight, Loader2, Mail, RefreshCw } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

import { getSiteSettings } from "@/api/siteSettingsApi";

const ContactInfo = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: getSiteSettings,
  });

  const settings = data?.settings || data?.data || data || {};

  const contactItems = [
    {
      label: "Email",
      value: settings.email,
      href: settings.email ? `mailto:${settings.email}` : null,
      icon: Mail,
    },
    {
      label: "GitHub",
      value: settings.github,
      href: settings.github || null,
      icon: FaGithub,
    },
    {
      label: "LinkedIn",
      value: settings.linkedin,
      href: settings.linkedin || null,
      icon: FaLinkedin,
    },
  ].filter((item) => item.value && item.href);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-xl border bg-card p-4"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <p className="text-sm font-medium">
          Unable to load contact information.
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Please try again.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className="size-3.5" />
          Try again
        </button>
      </div>
    );
  }

  if (contactItems.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-5">
        <p className="text-sm font-medium">
          Contact details are currently unavailable.
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          You can still use the contact form to send a message.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contactItems.map((item) => {
        const Icon = item.icon;
        const isExternal = item.href.startsWith("http");

        return (
          <a
            key={item.label}
            href={item.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
              <Icon className="size-4 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">
                {item.label}
              </p>

              <p className="mt-1 truncate text-sm font-medium">{item.value}</p>
            </div>

            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          </a>
        );
      })}
    </div>
  );
};

export default ContactInfo;
