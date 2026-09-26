import { Navigate, createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicOnlyRoute from "@/components/auth/PublicOnlyRoute";

import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import PublicLayout from "@/layouts/PublicLayout";

import Home from "@/pages/public/Home";

import RouteError from "@/pages/RouteError";
import RouteLoading from "@/components/RouteLoading";

const loadPage = (load) => async () => ({ Component: (await load()).default });

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <RouteError />,
    HydrateFallback: RouteLoading,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/projects",
        lazy: loadPage(() => import("@/pages/public/Projects")),
      },
      {
        path: "/projects/:slug",
        lazy: loadPage(() => import("@/pages/public/ProjectDetails")),
      },
      {
        path: "/blog",
        lazy: loadPage(() => import("@/pages/public/Blogs")),
      },
      {
        path: "/blog/:slug",
        lazy: loadPage(() => import("@/pages/public/BlogDetails")),
      },
      {
        path: "/contact",
        lazy: loadPage(() => import("@/pages/public/Contact")),
      },
      {
        path: "/background",
        lazy: loadPage(() => import("@/pages/public/Background")),
      },

      {
        path: "*",
        lazy: loadPage(() => import("@/pages/NotFound")),
      },
      {
        path: "/resume",
        lazy: loadPage(() => import("@/pages/public/Resume")),
      },
    ],
  },

  {
    element: <PublicOnlyRoute />,
    errorElement: <RouteError />,
    HydrateFallback: RouteLoading,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/auth/login",
            lazy: loadPage(() => import("@/pages/auth/Login")),
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    errorElement: <RouteError />,
    HydrateFallback: RouteLoading,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin",
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: "/admin/dashboard",
            lazy: loadPage(() => import("@/pages/admin/Dashboard")),
          },
          {
            path: "/admin/projects",
            lazy: loadPage(() => import("@/pages/admin/Projects")),
          },
          {
            path: "/admin/projects/create",
            lazy: loadPage(() => import("@/pages/admin/ProjectCreate")),
          },
          {
            path: "/admin/projects/:id/edit",
            lazy: loadPage(() => import("@/pages/admin/ProjectEdit")),
          },
          {
            path: "/admin/blogs",
            lazy: loadPage(() => import("@/pages/admin/Blogs")),
          },
          {
            path: "/admin/blogs/create",
            lazy: loadPage(() => import("@/pages/admin/BlogCreate")),
          },
          {
            path: "/admin/blogs/:id/edit",
            lazy: loadPage(() => import("@/pages/admin/BlogEdit")),
          },
          {
            path: "/admin/experience",
            lazy: loadPage(() => import("@/pages/admin/Experience")),
          },
          {
            path: "/admin/certificates",
            lazy: loadPage(() => import("@/pages/admin/Certificate")),
          },
          {
            path: "/admin/skills",
            lazy: loadPage(() => import("@/pages/admin/Skill")),
          },
          {
            path: "/admin/messages",
            lazy: loadPage(() => import("@/pages/admin/Messages")),
          },
          {
            path: "/admin/resume",
            lazy: loadPage(() => import("@/pages/admin/Resume")),
          },
          {
            path: "/admin/settings",
            lazy: loadPage(() => import("@/pages/admin/Settings")),
          },
        ],
      },
    ],
  },
]);

export default router;
