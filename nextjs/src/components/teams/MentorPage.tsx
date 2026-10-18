import { Page } from "@/components/shell/Page";
import { getMentor } from "@/content/teams";

/**
 * STUB (courses builder fills this in). Route /teams/<slug>. Framer module 9u2BPm54*.mjs (`Team Social Icon`). Data: getMentor(slug); its course cards are CourseCard.
 * Sections, in order, each root carrying data-section="<Framer layer name>" for qa/compare.mjs:
 *   Hero Section / Details Section
 */
export function MentorPage({ slug }: { slug: string }) {
  void getMentor(slug);
  return (
    <Page>
      <section data-section="Hero Section" />
      <section data-section="Details Section" />
    </Page>
  );
}
