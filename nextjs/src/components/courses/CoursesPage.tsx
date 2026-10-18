import { Page } from "@/components/shell/Page";

/**
 * STUB (courses builder fills this in). Route /courses. Course grid of CourseCard + LoadMoreButton.
 * Sections, in order, each root carrying data-section="<Framer layer name>" for qa/compare.mjs:
 *   Hero Section / Course Section
 */
export function CoursesPage() {
  return (
    <Page>
      <section data-section="Hero Section" />
      <section data-section="Course Section" />
    </Page>
  );
}
