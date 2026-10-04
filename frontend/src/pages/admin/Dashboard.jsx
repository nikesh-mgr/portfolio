import { Award, BriefcaseBusiness, FileText, Sparkles } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { getAdminBlogs } from "@/api/blogApi";
import { getAdminCertificates } from "@/api/certificateApi";
import { getExperiences } from "@/api/experienceApi";
import { getAdminProjects } from "@/api/projectApi";
import { getSkills } from "@/api/skillApi";

import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminLoadingState from "@/components/admin/AdminLoadingState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DashboardSection from "@/components/dashboard/DashboardSection";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentBlogs from "@/components/dashboard/RecentBlogs";
import RecentProjects from "@/components/dashboard/RecentProjects";

import useAuth from "@/hooks/useAuth";

const extractList = (response, key) => {
  if (Array.isArray(response?.[key])) {
    return response[key];
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response)) {
    return response;
  }

  return [];
};

const getDateValue = (...dates) => {
  const date = dates.find(Boolean);

  if (!date) {
    return 0;
  }

  const timestamp = new Date(date).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const Dashboard = () => {
  const { admin } = useAuth();

  const results = useQueries({
    queries: [
      {
        queryKey: ["projects"],
        queryFn: getAdminProjects,
      },
      {
        queryKey: ["blogs"],
        queryFn: getAdminBlogs,
      },
      {
        queryKey: ["experiences"],
        queryFn: getExperiences,
      },
      {
        queryKey: ["skills"],
        queryFn: getSkills,
      },
      {
        queryKey: ["certificates"],
        queryFn: getAdminCertificates,
      },
    ],
  });

  const isLoading = results.some((result) => result.isPending);

  const hasError = results.some((result) => result.isError);

  if (isLoading) {
    return <AdminLoadingState message="Loading dashboard..." />;
  }

  if (hasError) {
    const failedQuery = results.find((result) => result.isError);

    return (
      <AdminErrorState
        title="Unable to load dashboard"
        description={
          failedQuery?.error?.response?.data?.message ||
          "Some portfolio data could not be loaded."
        }
        onRetry={() => {
          results.forEach((result) => {
            if (result.isError) {
              result.refetch();
            }
          });
        }}
      />
    );
  }

  const [
    projectsResult,
    blogsResult,
    experiencesResult,
    skillsResult,
    certificatesResult,
  ] = results;

  const projects = extractList(projectsResult.data, "projects");

  const blogs = extractList(blogsResult.data, "blogs");

  const experiences = extractList(experiencesResult.data, "experiences");

  const skills = extractList(skillsResult.data, "skills");

  const certificates = extractList(certificatesResult.data, "certificates");

  const recentProjects = [...projects]
    .sort(
      (firstProject, secondProject) =>
        getDateValue(secondProject.createdAt, secondProject.updatedAt) -
        getDateValue(firstProject.createdAt, firstProject.updatedAt),
    )
    .slice(0, 5);

  const recentBlogs = [...blogs]
    .sort(
      (firstBlog, secondBlog) =>
        getDateValue(
          secondBlog.publishedAt,
          secondBlog.createdAt,
          secondBlog.updatedAt,
        ) -
        getDateValue(
          firstBlog.publishedAt,
          firstBlog.createdAt,
          firstBlog.updatedAt,
        ),
    )
    .slice(0, 5);

  const publishedBlogs = blogs.filter((blog) => blog.published === true).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description={`Welcome back${
          admin?.name ? `, ${admin.name}` : ""
        }. Here's an overview of your portfolio.`}
      />

      <section aria-labelledby="dashboard-statistics">
        <h2 id="dashboard-statistics" className="sr-only">
          Portfolio statistics
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <DashboardStatCard
            title="Projects"
            value={projects.length}
            description="Portfolio projects"
            icon={BriefcaseBusiness}
            href="/admin/projects"
          />

          <DashboardStatCard
            title="Articles"
            value={blogs.length}
            description={`${publishedBlogs} published`}
            icon={FileText}
            href="/admin/blogs"
          />

          <DashboardStatCard
            title="Experience"
            value={experiences.length}
            description="Career entries"
            icon={BriefcaseBusiness}
            href="/admin/experience"
          />

          <DashboardStatCard
            title="Skills"
            value={skills.length}
            description="Technical skills"
            icon={Sparkles}
            href="/admin/skills"
          />

          <DashboardStatCard
            title="Certificates"
            value={certificates.length}
            description="Certification entries"
            icon={Award}
            href="/admin/certificates"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <DashboardSection
          title="Recent projects"
          description="Your latest portfolio work."
          action={
            <Link
              to="/admin/projects"
              className="rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View all
            </Link>
          }
        >
          <RecentProjects projects={recentProjects} />
        </DashboardSection>

        <DashboardSection
          title="Quick actions"
          description="Common portfolio tasks."
        >
          <QuickActions />
        </DashboardSection>
      </section>

      <DashboardSection
        title="Recent articles"
        description="Your latest content."
        action={
          <Link
            to="/admin/blogs"
            className="rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View all
          </Link>
        }
      >
        <RecentBlogs blogs={recentBlogs} />
      </DashboardSection>
    </div>
  );
};

export default Dashboard;
