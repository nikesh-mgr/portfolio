import { Award, BriefcaseBusiness, FileText, Sparkles } from "lucide-react";
import { useQueries } from "@tanstack/react-query";

import { getBlogs } from "@/api/blogApi";
import { getCertificates } from "@/api/certificateApi";
import { getExperiences } from "@/api/experienceApi";
import { getProjects } from "@/api/projectApi";
import { getSkills } from "@/api/skillApi";

import DashboardSection from "@/components/dashboard/DashboardSection";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentBlogs from "@/components/dashboard/RecentBlogs";
import RecentProjects from "@/components/dashboard/RecentProjects";
import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminLoadingState from "@/components/admin/AdminLoadingState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

import useAuth from "@/hooks/useAuth";

const Dashboard = () => {
  const { admin } = useAuth();

  const results = useQueries({
    queries: [
      {
        queryKey: ["projects", "dashboard"],
        queryFn: getProjects,
      },
      {
        queryKey: ["blogs", "dashboard"],
        queryFn: getBlogs,
      },
      {
        queryKey: ["experiences", "dashboard"],
        queryFn: getExperiences,
      },
      {
        queryKey: ["skills", "dashboard"],
        queryFn: getSkills,
      },
      {
        queryKey: ["certificates", "dashboard"],
        queryFn: getCertificates,
      },
    ],
  });

  const isLoading = results.some((result) => result.isLoading);
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
          results.forEach((result) => result.refetch());
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

  const projects =
    projectsResult.data?.projects || projectsResult.data?.data || [];

  const blogs = blogsResult.data?.blogs || blogsResult.data?.data || [];

  const experiences =
    experiencesResult.data?.experiences || experiencesResult.data?.data || [];

  const skills = skillsResult.data?.skills || skillsResult.data?.data || [];

  const certificates =
    certificatesResult.data?.certificates ||
    certificatesResult.data?.data ||
    [];

  const recentProjects = [...projects]
    .sort(
      (firstProject, secondProject) =>
        new Date(secondProject.createdAt || secondProject.updatedAt || 0) -
        new Date(firstProject.createdAt || firstProject.updatedAt || 0),
    )
    .slice(0, 5);

  const recentBlogs = [...blogs]
    .sort(
      (firstBlog, secondBlog) =>
        new Date(
          secondBlog.publishedAt ||
            secondBlog.createdAt ||
            secondBlog.updatedAt ||
            0,
        ) -
        new Date(
          firstBlog.publishedAt ||
            firstBlog.createdAt ||
            firstBlog.updatedAt ||
            0,
        ),
    )
    .slice(0, 5);

  const publishedBlogs = blogs.filter(
    (blog) => blog.published !== false,
  ).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description={`Welcome back${
          admin?.name ? `, ${admin.name}` : ""
        }. Here's an overview of your portfolio.`}
      />

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
      </section>

      {/* Recent Projects + Quick Actions */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <DashboardSection
          title="Recent projects"
          description="Your latest portfolio work."
          action={
            <a
              href="/admin/projects"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </a>
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

      {/* Recent Articles */}
      <DashboardSection
        title="Recent articles"
        description="Your latest published content."
        action={
          <a
            href="/admin/blogs"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </a>
        }
      >
        <RecentBlogs blogs={recentBlogs} />
      </DashboardSection>
    </div>
  );
};

export default Dashboard;
