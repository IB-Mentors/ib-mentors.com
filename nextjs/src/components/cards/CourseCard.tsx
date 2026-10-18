import type { Course } from "@/content/courses";

/**
 * STUB with a fixed props contract (courses builder fills in the visuals). Framer component "Course Card"
 * (qa/framer-src/MlJdimrhP.*.mjs). Used on / (home builder imports it), /courses and /teams/<slug>.
 * Variants seen in the SSR HTML: "Desktop Course Card", "Secondary" (and per-breakpoint swaps), or pass
 * { desktop, tablet?, phone? }. Links to /courses/<slug>. Fields come from course.card.
 */
export type CourseCardVariant = string | { desktop: string; tablet?: string; phone?: string };

export function CourseCard({ course, variant, className }: { course: Course; variant?: CourseCardVariant; className?: string }) {
  void variant;
  return (
    <a href={`/courses/${course.slug}`} className={className} data-framer-name="Desktop Course Card">
      {course.card?.title ?? course.title}
    </a>
  );
}
