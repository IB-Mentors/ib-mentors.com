import { Page } from "@/components/shell/Page";

/**
 * STUB (shell + home builder fills this in). Route /. Framer page module QWoqitfISDBm*.mjs (displayName `Home`): Hero, Brand, Course (CourseCard), Process (Process Card V1), Team (TeamCard), Bento (Bento List, Counter Card, Action Card), Call To Action, Blogs (Blog Card V1).
 * Sections, in order, each root carrying data-section="<Framer layer name>" for qa/compare.mjs:
 *   Hero Section / Brand Section / Course Section / Process Section / Team Section / Bento Section / Call To Action Section / Blogs Section
 */
export function HomePage() {
  return (
    <Page>
      <section data-section="Hero Section" />
      <section data-section="Brand Section" />
      <section data-section="Course Section" />
      <section data-section="Process Section" />
      <section data-section="Team Section" />
      <section data-section="Bento Section" />
      <section data-section="Call To Action Section" />
      <section data-section="Blogs Section" />
    </Page>
  );
}
