import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const ContactInfo = ({ settings }) => {
  const contactEmail = settings?.contactEmail || "";
  const location = settings?.location || "";
  const socialLinks = settings?.socialLinks || {};

  const contactItems = [
    {
      label: "Email",
      value: contactEmail,
      href: contactEmail ? `mailto:${contactEmail}` : null,
      icon: Mail,
    },
    {
      label: "Location",
      value: location,
      href: null,
      icon: MapPin,
    },
    {
      label: "GitHub",
      value: socialLinks.github,
      href: socialLinks.github || null,
      icon: FaGithub,
    },
    {
      label: "LinkedIn",
      value: socialLinks.linkedin,
      href: socialLinks.linkedin || null,
      icon: FaLinkedin,
    },
    {
      label: "Twitter / X",
      value: socialLinks.twitter,
      href: socialLinks.twitter || null,
      icon: FaTwitter,
    },
    {
      label: "Facebook",
      value: socialLinks.facebook,
      href: socialLinks.facebook || null,
      icon: FaFacebook,
    },
    {
      label: "Instagram",
      value: socialLinks.instagram,
      href: socialLinks.instagram || null,
      icon: FaInstagram,
    },
  ].filter((item) => item.value);

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
        const isClickable = Boolean(item.href);
        const isExternal = item.href?.startsWith("http");

        const content = (
          <>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
              <Icon className="size-4 text-primary" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">
                {item.label}
              </p>

              <p className="mt-1 truncate text-sm font-medium">{item.value}</p>
            </div>

            {isClickable && (
              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            )}
          </>
        );

        if (!isClickable) {
          return (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-xl border bg-card p-4"
            >
              {content}
            </div>
          );
        }

        return (
          <a
            key={item.label}
            href={item.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {content}
          </a>
        );
      })}
    </div>
  );
};

export default ContactInfo;
