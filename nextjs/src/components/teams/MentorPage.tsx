import { Page } from "@/components/shell/Page";
import { CourseCard } from "@/components/cards/CourseCard";
import { Appear, SECTION_APPEAR } from "@/components/courses/Appear";
import { HeroLine } from "@/components/courses/PageHero";
import { getCourse, type Course } from "@/content/courses";
import { getMentor } from "@/content/teams";
import s from "./MentorPage.module.css";

/**
 * Route /teams/<slug>. Framer page module 9u2BPm54*.mjs (framer-v23Zu) with its `Team Social Icon` component.
 * Sections: Hero Section (only the Line, 242 / 223 / 171px tall) / Details Section: the sticky navy
 * " Detils Wrapper" (photo, university, name, description, four social icons) beside the mentor's Course Cards.
 * Social icons: "Team Social Icon V1" on desktop (hover: background turns orange, tween 0.4 s), V2 elsewhere.
 * Framer SSRs the icons as <a> without href (the CMS links are empty), so they are rendered the same way.
 */
export function MentorPage({ slug }: { slug: string }) {
  const m = getMentor(slug);
  if (!m) return null;
  // socials holds each icon twice (V1, V2 in SSR order): one per icon here.
  const icons = m.socials.filter((_, i) => i % 2 === 0);
  const courses = m.courses.map((c) => getCourse(c)).filter((c): c is Course => !!c);
  return (
    <Page>
      <section className={s.hero} data-section="Hero Section" data-framer-name="Hero Section">
        <HeroLine />
      </section>
      <section className={s.section} data-section="Details Section" data-framer-name="Details Section">
        <div className={s.container} data-framer-name="Container">
          <Appear preset={SECTION_APPEAR} className={s.content} name="Content">
            <div className={s.wrapper} data-framer-name="Content Wrapper">
              <div className={s.details} data-framer-name=" Detils Wrapper">
                <div className={s.photo}>
                  {m.image ? <img src={m.image.src} alt={m.image.alt} decoding="async" /> : null}
                </div>
                <div className={s.text} data-framer-name="Designation & Social Icon ">
                  <div className={s.col15} data-framer-name="Designation & Short Description">
                    <div className={s.col10} data-framer-name="Designation & Author Name">
                      <div className={s.rt} data-framer-name="Designation">
                        <p className={`p-w4t77b ${s.orange}`}>{m.designation}</p>
                      </div>
                      <div className={s.rt} data-framer-name="Author Name">
                        <h3 className={`p-qapw0k ${s.white}`}>{m.name}</h3>
                      </div>
                    </div>
                    <div className={s.rt} data-framer-name="Short Description">
                      <p className={`p-1ijstdn ${s.white70}`}>{m.description}</p>
                    </div>
                  </div>
                  <div className={s.socials} data-framer-name="Social Icon Wrapper">
                    {icons.map((ic, i) => (
                      <div key={i} className={s.socialBox} data-framer-name="Team Social Icon">
                        <a
                          className={`${s.social} ${s.v1} hide-tablet hide-phone`}
                          data-framer-name="Team Social Icon V1"
                          {...(ic.href ? { href: ic.href, target: "_blank", rel: "noopener" } : {})}
                        >
                          <div className={s.socialIcon} data-framer-name="Icon">
                            {ic.icon ? <img src={ic.icon} alt="Icon" /> : null}
                          </div>
                        </a>
                        <a
                          className={`${s.social} ${s.v2} hide-desktop`}
                          data-framer-name="Team Social Icon V2"
                          {...(ic.href ? { href: ic.href, target: "_blank", rel: "noopener" } : {})}
                        >
                          <div className={s.socialIcon} data-framer-name="Icon">
                            {ic.icon ? <img src={ic.icon} alt="Icon" /> : null}
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={s.grid}>
                {courses.map((c) => (
                  <div key={c.slug} className={s.item}>
                    <CourseCard course={c} variant={{ desktop: "Desktop Course Card", tablet: "Secondary", phone: "Secondary" }} />
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
