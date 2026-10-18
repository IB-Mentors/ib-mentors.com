import { Page } from "@/components/shell/Page";
import { COURSES } from "@/content/courses";
import { Appear, SECTION_APPEAR } from "./Appear";
import { PageHero } from "./PageHero";
import { CourseGrid } from "./CourseGrid";
import s from "./CoursesPage.module.css";

/**
 * Route /courses. Framer page module XZwK-Lkbm*.mjs (displayName `Teams`, framer-2I2gV): Hero Section +
 * Course Section (grid of Course Cards, 3 / 2 / 1 per row). The collection list pages 6 / 4 / 3 cards
 * (desktop / tablet / phone), so only the phone shows the "Load More V2" button (もっと見る) under 3 cards.
 */
export function CoursesPage() {
  return (
    <Page>
      <PageHero
        title="コース・プラン一覧"
        description="Individual course that tailors to your special needs, start with a free consultation to find the perfect plan for you."
      />
      <section className={s.section} data-section="Course Section" data-framer-name="Course Section">
        <div className={s.container} data-framer-name="Container">
          <Appear preset={SECTION_APPEAR} className={s.content} name="Content">
            <div className={s.cardWrapper} data-framer-name="Card Wrapper">
              <CourseGrid courses={COURSES} />
            </div>
          </Appear>
        </div>
      </section>
    </Page>
  );
}
