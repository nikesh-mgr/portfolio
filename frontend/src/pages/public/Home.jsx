import { useQuery } from "@tanstack/react-query";

import AboutSection from "@/components/home/AboutSection";
import CertificatesSection from "@/components/home/CertificatesSection";
import ContactCta from "@/components/home/ContactCta";
import ExperienceSection from "@/components/home/ExperienceSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import HeroSection from "@/components/home/HeroSection";
import LatestArticles from "@/components/home/LatestArticles";
import { getSiteSettings } from "@/api/siteSettingsApi";

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: getSiteSettings,
    staleTime: 1000 * 60 * 10,
  });

  const settings = data?.settings ?? null;

  return (
    <div className="overflow-x-clip">
      <HeroSection settings={settings} isLoading={isLoading} />

      <AboutSection />

      <FeaturedProjects />

      <ExperienceSection />

      <CertificatesSection />

      <LatestArticles />

      <ContactCta />
    </div>
  );
};

export default Home;
