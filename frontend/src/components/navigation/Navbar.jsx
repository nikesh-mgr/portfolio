import { FileText } from "lucide-react";
import { NavLink } from "react-router-dom";
import MobileNav from "./MobileNav";
import ThemeToggle from "@/components/theme/ThemeToggle";
const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Background", href: "/background" },
  { label: "Contact", href: "/contact" },
];
const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
      {" "}
      <div className="container-page">
        {" "}
        <div className="flex min-h-16 items-center justify-between gap-4 sm:min-h-18">
          {" "}
          <NavLink to="/" className="shrink-0" aria-label="Go to homepage">
            {" "}
            <span className="text-base font-bold tracking-tight sm:text-lg">
              {" "}
              Portfolio{" "}
            </span>{" "}
          </NavLink>{" "}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {" "}
            {navigationItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  [
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")
                }
              >
                {" "}
                {item.label}{" "}
              </NavLink>
            ))}{" "}
          </nav>{" "}
          <div className="hidden items-center gap-2 lg:flex">
            {" "}
            <ThemeToggle />{" "}
            <NavLink
              to="/resume"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {" "}
              <FileText className="size-4" /> Resume{" "}
            </NavLink>{" "}
            <NavLink
              to="/contact"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {" "}
              Let's Talk{" "}
            </NavLink>{" "}
          </div>{" "}
          <div className="flex items-center gap-2 lg:hidden">
            {" "}
            <ThemeToggle /> <MobileNav navigationItems={navigationItems} />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
};
export default Navbar;
