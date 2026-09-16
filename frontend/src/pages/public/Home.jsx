import AboutSection from "@/components/home/AboutSection";
import CertificatesSection from "@/components/home/CertificatesSection";
import ContactCta from "@/components/home/ContactCta";

import ExperienceSection from "@/components/home/ExperienceSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import HeroSection from "@/components/home/HeroSection";
import LatestArticles from "@/components/home/LatestArticles";

const Home = () => {
  return (
    <div>
      <HeroSection />

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
