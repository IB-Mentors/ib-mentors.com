import { Page } from "@/components/shell/Page";
import { TeamCard } from "@/components/cards/TeamCard";
import { Appear, SECTION_APPEAR } from "@/components/courses/Appear";
import { PageHero } from "@/components/courses/PageHero";
import { MENTORS } from "@/content/teams";
import s from "./TeamsPage.module.css";

/**
 * Route /teams. Framer page module WFFG7yWM*.mjs (framer-RwAXq): Hero Section (same hero as /courses) +
 * Team Section (grid of Team Cards, 3 / 2 / 1 per row; card variant Desktop Team Card / Secondary / Tertiary).
 * The collection's Load More sits in its Hidden state (one mentor), so it renders nothing.
 */
export function TeamsPage() {
  return (
    <Page>
      <PageHero
        title="メンター紹介"
        description="Meet our mentors, gain practical insights, and accelerate your learning journey with guidance from experienced IB educators."
      />
      <section className={s.section} data-section="Team Section" data-framer-name="Team Section">
        <div className={s.container} data-framer-name="Container">
          <Appear preset={SECTION_APPEAR} className={s.content} name="Content">
            <div className={s.cardWrapper} data-framer-name="Card Wrapper">
              <div className={s.grid}>
                {MENTORS.map((m) => (
                  <div key={m.slug} className={s.item}>
                    <TeamCard mentor={m} variant={{ desktop: "Desktop Team Card", tablet: "Secondary", phone: "Tertiary" }} />
                  </div>
                ))}
              </div>
            </div>
          </Appear>
        </div>
      </section>
    </Page>
  );
}
