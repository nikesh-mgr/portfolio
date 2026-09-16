import { ArrowUp, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container-page">
        <div className="grid gap-10 py-12 md:grid-cols-3 md:py-16">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block text-lg font-bold tracking-tight"
            >
              Portfolio
            </Link>

            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              A personal developer portfolio showcasing projects, technical
              skills, experience, and professional work.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="mb-4 text-sm font-semibold">Navigation</h2>

            <nav className="flex flex-col items-start gap-2">
              <Link
                to="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </Link>

              <Link
                to="/projects"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Projects
              </Link>

              <Link
                to="/blog"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Blog
              </Link>

              <Link
                to="/contact"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h2 className="mb-4 text-sm font-semibold">Connect</h2>

            <div className="flex items-center gap-2">
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="inline-flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <FaGithub className="size-4" />
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="inline-flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <FaLinkedinIn className="size-4" />
              </a>

              {/* Email */}
              <a
                href="mailto:your@email.com"
                aria-label="Email"
                className="inline-flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground sm:text-sm">
            © {currentYear} Portfolio. All rights reserved.
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="w-fit gap-2"
          >
            Back to top
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
