import { Page } from "@/components/shell/Page";
import { HeroSection } from "./HeroSection";
import { BrandSection } from "./BrandSection";
import { CourseSection } from "./CourseSection";
import { ProcessSection } from "./ProcessSection";
import { TeamSection } from "./TeamSection";
import { BentoSection } from "./BentoSection";
import { CallToActionSection } from "./CallToActionSection";
import { BlogsSection } from "./BlogsSection";

/**
 * Route /. Framer page module QWoqitfISDBm*.mjs (displayName `Home`): Hero, Brand, Course (CourseCard), Process
 * (Process Card V1), Team (TeamCard), Bento (Bento List, Counter Card, Action Card), Call To Action, Blogs (Blog Card V1).
 * Each section root carries data-section="<Framer layer name>" for qa/compare.mjs.
 */
export function HomePage() {
  return (
    <Page>
      <HeroSection />
      <BrandSection />
      <CourseSection />
      <ProcessSection />
      <TeamSection />
      <BentoSection />
      <CallToActionSection />
      <BlogsSection />
    </Page>
  );
}
