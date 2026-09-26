import { Navigate, createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicOnlyRoute from "@/components/auth/PublicOnlyRoute";

import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import PublicLayout from "@/layouts/PublicLayout";

import BlogDetails from "@/pages/public/BlogDetails";
import Blogs from "@/pages/public/Blogs";
import Contact from "@/pages/public/Contact";
import Home from "@/pages/public/Home";
import ProjectDetails from "@/pages/public/ProjectDetails";
import Projects from "@/pages/public/Projects";
import Background from "@/pages/public/Background";
import Resume from "@/pages/public/Resume";
import Login from "@/pages/auth/Login";

import AdminProjects from "@/pages/admin/Projects";
import Dashboard from "@/pages/admin/Dashboard";
import ProjectCreate from "@/pages/admin/ProjectCreate";
import ProjectEdit from "@/pages/admin/ProjectEdit";
import BlogCreate from "@/pages/admin/BlogCreate";
import BlogEdit from "@/pages/admin/BlogEdit";
import AdminBlogs from "@/pages/admin/Blogs";
import AdminExperience from "@/pages/admin/Experience";
import AdminCertificate from "@/pages/admin/Certificate";
import AdminSkill from "@/pages/admin/Skill";
import AdminMessages from "@/pages/admin/Messages";
import AdminResume from "@/pages/admin/Resume";
import AdminSettings from "@/pages/admin/Settings";
import CreateAdmin from "@/components/auth/CreateAdmin";
const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/projects/:slug",
        element: <ProjectDetails />,
      },
      {
        path: "/blog",
        element: <Blogs />,
      },
      {
        path: "/blog/:slug",
        element: <BlogDetails />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/background",
        element: <Background />,
      },

      {
        path: "/resume",
        element: <Resume />,
      },
    ],
  },

  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/auth/login",
            element: <Login />,
          },
          {
            path: "/auth/create-admin",
            element: <CreateAdmin />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: <Navigate to="/dashboard" replace /> },
          {
            path: "/admin/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/admin/projects",
            element: <AdminProjects />,
          },
          {
            path: "/admin/projects/create",
            element: <ProjectCreate />,
          },
          {
            path: "/admin/projects/:id/edit",
            element: <ProjectEdit />,
          },
          {
            path: "/admin/blogs",
            element: <AdminBlogs />,
          },
          {
            path: "/admin/blogs/create",
            element: <BlogCreate />,
          },
          {
            path: "/admin/blogs/:id/edit",
            element: <BlogEdit />,
          },
          {
            path: "/admin/experience",
            element: <AdminExperience />,
          },
          {
            path: "/admin/certificates",
            element: <AdminCertificate />,
          },
          {
            path: "/admin/skills",
            element: <AdminSkill />,
          },
          {
            path: "/admin/messages",
            element: <AdminMessages />,
          },
          {
            path: "admin/resume",
            element: <AdminResume />,
          },
          { path: "/admin/settings", element: <AdminSettings /> },
        ],
      },
    ],
  },
]);

export default router;
