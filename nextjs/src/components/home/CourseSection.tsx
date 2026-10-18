import s from "./Home.module.css";
import { CourseCard } from "@/components/cards/CourseCard";
import { getCourse } from "@/content/courses";
import { Button } from "@/components/ui/Button";
import { ScrollAppear } from "./fx";

const SLUGS = ["ib-weekly-mentoring", "ib-study-plan-design", "ee-extended-essay-full-support", "ia-subject-complete"];

/** Framer "Course Section" (page module QWoqitfISDBm*.mjs, displayName `Home`). */
export function CourseSection() {
  return (
    <section className={s.c_kxy65c} data-section="Course Section" data-framer-name="Course Section">
      <div className={s.c_cx1iwz} data-framer-name="Container">
        <ScrollAppear className={s.c_18vmi8g} data-framer-name="Content">
          <div className={s.c_151hdkb} data-framer-name="Title Wrapper">
            <div className={`${s.c_1cxiy9x} ${s.rt}`}>
              <h2 className={`p-1ktddze`} dir="auto" style={{textAlign: "center", color: "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(86, 125, 125))"}}>
                IBを勝ち抜いた
                <br />
                <span style={{color: "var(--token-6b7381ba-6de4-49e1-a897-8666d0895cc7, rgb(207, 117, 39))"}}>
                  メンターと
                  <br />
                </span>
                最短スコアアップ
              </h2>
            </div>
            <div className={`${s.c_rjfruz} ${s.rt}`}>
              <p className={`p-1ijstdn`} dir="auto" style={{textAlign: "center", color: "var(--token-c7693201-4213-426e-a6de-0fbb44d0f402, rgb(68, 68, 68))"}}>
                High-Quality Lessons Tailored for Every Learner
              </p>
            </div>
          </div>
          <div className={s.c_1szlsei} data-framer-name="Card & Button Wrapper">
            <div className={s.c_5787n7} data-framer-name="Card Wrapper">
              <div className={s.c_1qutx34}>
                {SLUGS.map((slug, i) => (
                  <div key={slug} className={`${s.c_1f8sf2w_container}${i === 3 ? " hide-phone" : ""}`}>
                    <CourseCard course={getCourse(slug)!} variant={{ desktop: "Desktop Course Card", tablet: "Secondary", phone: "Secondary" }} />
                  </div>
                ))}
              </div>
            </div>
            <div className={s.c_134gn4z_container} data-framer-name="Button">
              <Button label="もっと見る" href="/courses" variant={{ desktop: "Hero Button V1", tablet: "Hero Button V2", phone: "Hero Button V2" }} />
            </div>
          </div>
        </ScrollAppear>
      </div>
    </section>
  );
}
