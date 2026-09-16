import { FileText, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/theme/ThemeToggle";
const MobileNav = ({ navigationItems }) => {
  return (
    <Sheet>
      {" "}
      <SheetTrigger
        className="inline-flex size-10 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open navigation menu"
      >
        {" "}
        <Menu className="size-5" />{" "}
      </SheetTrigger>{" "}
      <SheetContent
        side="right"
        className="flex w-[300px] flex-col sm:w-[360px]"
      >
        {" "}
        <SheetHeader className="border-b pb-5 text-left">
          {" "}
          <SheetTitle>Portfolio</SheetTitle>{" "}
          <p className="text-sm text-muted-foreground">
            {" "}
            Navigate through my portfolio{" "}
          </p>{" "}
        </SheetHeader>{" "}
        <nav className="flex-1 py-4" aria-label="Mobile navigation">
          {" "}
          <div className="space-y-1">
            {" "}
            {navigationItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  [
                    "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                {" "}
                {item.label}{" "}
              </NavLink>
            ))}{" "}
          </div>{" "}
        </nav>{" "}
        <div className="space-y-3 border-t pt-4">
          {" "}
          <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3">
            {" "}
            <div>
              {" "}
              <p className="text-sm font-medium">Appearance</p>{" "}
              <p className="text-xs text-muted-foreground">
                {" "}
                Switch light or dark mode{" "}
              </p>{" "}
            </div>{" "}
            <ThemeToggle />{" "}
          </div>{" "}
          <NavLink
            to="/resume"
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {" "}
            <FileText className="size-4" /> View Resume{" "}
          </NavLink>{" "}
        </div>{" "}
      </SheetContent>{" "}
    </Sheet>
  );
};
export default MobileNav;
