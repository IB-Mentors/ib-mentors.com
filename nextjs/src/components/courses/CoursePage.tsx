import { Page } from "@/components/shell/Page";
import { getCourse } from "@/content/courses";

/**
 * STUB (courses builder fills this in). Route /courses/<slug>. Framer module T3Do1bk5JaF*.mjs (`Courses`, `Courses Details List`, `Course Information List`, `Star Icon`). Data: getCourse(slug).
 * Sections, in order, each root carrying data-section="<Framer layer name>" for qa/compare.mjs:
 *   Hero Section / Details Section
 */
export function CoursePage({ slug }: { slug: string }) {
  void getCourse(slug);
  return (
    <Page>
      <section data-section="Hero Section" />
      <section data-section="Details Section" />
    </Page>
  );
}
