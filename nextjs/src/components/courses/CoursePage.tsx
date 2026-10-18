import { Page } from "@/components/shell/Page";
import { Button } from "@/components/ui/Button";
import { getCourse } from "@/content/courses";
import { MENTORS } from "@/content/teams";
import { Appear, SECTION_APPEAR } from "./Appear";
import { PageHero } from "./PageHero";
import { GoBackButton } from "./GoBackButton";
import { richText } from "./richText";
import s from "./CoursePage.module.css";

/**
 * Route /courses/<slug>. Framer page module T3Do1bk5JaF*.mjs (`Courses`, framer-4BXy6) with its
 * `Courses Details List`, `Course Information List` and `Star Icon` components. Data: getCourse(slug).
 * Sections: Hero Section (PageHero, detail widths) / Details Section (left: the five rich-text blocks + the
 * mentor block; right: the sticky " Card Wrapper" with Card 01 (price + Course Information) and Card 02 (Overview)).
 * A rich-text block that is empty in the CMS (Content 01 on two courses) drops its wrapper, as Framer does.
 */

/** "Course Information List" row icons, by row (Level, Lectures, Duration, Total Enrolled, Lats Update). */
const INFO_ICONS = [
  "8cdZzrruB5gncLGhh0sgJJcvan0.svg",
  "Vcch6gCmX4B6txrfJyT9jOr2rc.svg",
  "dYcCSi9Mmc4EJ8RMszXoiuHXUWI.svg",
  "OynoleUBnftAphZLf3CEpK9VmI.svg",
  "5vRE4Ra2sUzf0CQ0D0lUn3Adl64.svg",
];
/** The rating beside the five stars (a CMS field not in src/content; copied from the Framer SSR of each course). */
const RATING: Record<string, string> = {
  "ib-weekly-mentoring": "4.9/5",
  "ib-study-plan-design": "4.9/5",
  "ee-extended-essay-full-support": "4.9/5",
  "ia-subject-complete": "4.8/5",
};

function Rich({ html, className, name }: { html: string; className: string; name: string }) {
  return <div className={`${s.rt} ${s.rich} ${className}`} data-framer-name={name} dangerouslySetInnerHTML={{ __html: richText(html) }} />;
}

export function CoursePage({ slug }: { slug: string }) {
  const c = getCourse(slug);
  if (!c) return null;
  const [c1 = "", c2 = "", c3 = "", c4 = "", c5 = ""] = c.content;
  // The mentor photo is the linked Teams entry's image (only "ib-weekly-mentoring" has one; the others show
  // Framer's empty-image placeholder pattern).
  const photo = MENTORS.find((m) => m.courses.includes(slug))?.image ?? null;
  return (
    <Page>
      <PageHero title={c.title} description={c.shortDescription} detail />
      <section className={s.section} data-section="Details Section" data-framer-name="Details Section">
        <div className={s.container} data-framer-name="Container">
          <Appear preset={SECTION_APPEAR} className={s.content} name="Content">
            <div className={s.wrapper} data-framer-name="Content Wrapper">
              <div className={s.left} data-framer-name="Left Content">
                <div className={s.textCard} data-framer-name=" Content Wrapper">
                  {c1 ? (
                    <div className={s.block} data-framer-name="Content Wrapper 01">
                      <Rich html={c1} className={s.full} name="Content 01" />
                    </div>
                  ) : null}
                  {c2 || c3 || c4 ? (
                    <div className={s.boxed} data-framer-name="Content Wrapper 02/03/04">
                      {c2 ? (
                        <div className={s.row02} data-framer-name="Content Wrapper 02">
                          <Rich html={c2} className={s.grow} name="Content 02" />
                        </div>
                      ) : null}
                      {c3 || c4 ? (
                        <div className={s.cols} data-framer-name="Content Wrapper 03/04">
                          {c3 ? (
                            <div className={`${s.col} ${s.col03}`} data-framer-name="Content Wrapper 03">
                              <Rich html={c3} className={s.grow} name="Content 03" />
                            </div>
                          ) : null}
                          {c4 ? (
                            <div className={s.col} data-framer-name="Content Wrapper 04">
                              <Rich html={c4} className={s.grow} name="Content 04" />
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {c5 ? (
                    <div className={s.block} data-framer-name="Content Wrapper 05">
                      <Rich html={c5} className={s.full} name="Content 05" />
                    </div>
                  ) : null}
                </div>
                <div className={s.mentor} data-framer-name=" Detils Wrapper">
                  <div className={s.photo}>
                    {photo ? (
                      <img src={photo.src} alt={photo.alt} decoding="async" />
                    ) : (
                      <div className={s.placeholder} />
                    )}
                  </div>
                  <div className={s.mentorText} data-framer-name="Designation & Social Icon ">
                    <div className={s.col15} data-framer-name="Designation & Short Description">
                      <div className={s.col10} data-framer-name="Designation & Author Name">
                        <div className={`${s.rt} ${s.full}`} data-framer-name="Text">
                          <p className={`p-w4t77b ${s.orange}`}>{c.mentor.designation}</p>
                        </div>
                        <div className={`${s.rt} ${s.full}`} data-framer-name="Author Name">
                          <h3 className={`p-qapw0k ${s.white}`}>{c.mentor.name}</h3>
                        </div>
                      </div>
                      <div className={`${s.rt} ${s.full}`} data-framer-name="Short Description">
                        <p className={`p-1ijstdn ${s.white70}`}>{c.mentor.description}</p>
                      </div>
                    </div>
                    <div className={s.stars} data-framer-name=" Icon Wrapper">
                      <div className={s.starRow} data-framer-name="5 Star">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div key={i} className={s.star} data-framer-name="Icon">
                            <img src="/framer/Mfhy21pOjpyadiUwzZ2B8vWKGM.svg" alt="Icon" />
                          </div>
                        ))}
                      </div>
                      <div className={`${s.rt} ${s.grow}`}>
                        <p className={`p-w4t77b ${s.white}`}>{RATING[slug] ?? "4.9/5"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={s.cards} data-framer-name=" Card Wrapper">
                <div className={s.card01} data-framer-name="Card 01">
                  <div className={s.priceTitle} data-framer-name="Price & Title">
                    <div className={`${s.rt} ${s.full}`} data-framer-name="Price">
                      <h2 className={`p-1ktddze ${s.orange}`}>{c.detailPrice}</h2>
                    </div>
                    <div className={`${s.rt} ${s.full}`} data-framer-name="Title">
                      <h5 className={`p-1q957ix ${s.white}`}>Course Information</h5>
                    </div>
                  </div>
                  <div className={s.infoList} data-framer-name="List Wrapper">
                    {c.info.map(([label, value], i) => (
                      <div key={i} className={s.infoItem}>
                        <div className={s.infoRow} data-framer-name="List V1">
                          <div className={s.iconText} data-framer-name="Icon & Text">
                            <div className={s.infoIcon} data-framer-name="Icon">
                              <img src={`/framer/${INFO_ICONS[i] ?? INFO_ICONS[0]}`} alt="Icon" />
                            </div>
                            <div className={`${s.rt} ${s.pre}`}>
                              <p className={`p-w4t77b ${s.white}`}>{label}</p>
                            </div>
                          </div>
                          <div className={`${s.rt} ${s.pre}`}>
                            <p className={`p-1ijstdn ${s.white70}`}>{value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className={s.infoItem} data-framer-name="Button">
                      <Button
                        label="Enroll Today"
                        href="/contact"
                        variant={{ desktop: "Tertiary Button V1", tablet: "Tertiary Button V2", phone: "Tertiary Button V2" }}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>
                <div className={s.card02} data-framer-name="Card 02">
                  <div className={s.overview} data-framer-name="List Wrapper">
                    <div className={`${s.rt} ${s.full}`} data-framer-name="Title">
                      <p className={`p-1ijstdn ${s.white}`}>Overview</p>
                    </div>
                    <div className={s.line} data-framer-name="Line" />
                    {c.overview.map((item, i) => (
                      <div key={i} className={s.infoItem}>
                        <div className={s.ovRow} data-framer-name="List">
                          <div className={s.ovIcon} data-framer-name="Icon">
                            <img src="/framer/oTQf3QQPxFNdEaAtCOyw2JYvJAI.svg" alt="Icon" />
                          </div>
                          <div className={`${s.rt} ${s.grow}`} data-framer-name="Title">
                            <p className={`p-1ijstdn ${s.white}`}>{item}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`${s.rt} ${s.full}`} data-framer-name="Short Description">
                    <p className={`p-1ijstdn ${s.white}`}>{c.overviewDescription}</p>
                  </div>
                </div>
              </div>
            </div>
            <GoBackButton href="/courses" />
          </Appear>
        </div>
      </section>
    </Page>
  );
}
