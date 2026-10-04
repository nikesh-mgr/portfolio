import {
  Award,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  Mail,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";

export const adminNavigation = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: BriefcaseBusiness,
  },
  {
    title: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    title: "Experience",
    href: "/admin/experience",
    icon: UserRound,
  },
  {
    title: "Skills",
    href: "/admin/skills",
    icon: Sparkles,
  },
  {
    title: "Certificates",
    href: "/admin/certificates",
    icon: Award,
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    title: "Resume",
    href: "/admin/resume",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];
