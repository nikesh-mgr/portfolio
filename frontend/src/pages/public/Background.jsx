import { useEffect } from "react";
import BackgroundHero from "@/components/background/BackgroundHero";
import CertificatesSection from "@/components/home/CertificatesSection";

import ExperienceSection from "@/components/home/ExperienceSection";
import SkillsSection from "@/components/home/SkillsSection";
import ContactCta from "@/components/home/ContactCta";
const Background = () => {
  return (
    <>
      <BackgroundHero />
      <main>
        <ExperienceSection id="experience" />
        <CertificatesSection id="certificates" />
        <SkillsSection id="skills" />
      </main>
      <ContactCta />
    </>
  );
};

export default Background;
