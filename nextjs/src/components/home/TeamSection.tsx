import s from "./Home.module.css";
import { TeamCard } from "@/components/cards/TeamCard";
import { getMentor } from "@/content/teams";
import { ScrollAppear } from "./fx";

/** Framer "Team Section" (page module QWoqitfISDBm*.mjs, displayName `Home`). */
export function TeamSection() {
  return (
    <section className={s.c_1bcb61w} data-section="Team Section" data-framer-name="Team Section">
      <div className={s.c_mg1dtn} data-framer-name="Container">
        <ScrollAppear className={s.c_sm56h2} data-framer-name="Content">
          <div className={s.c_xqw6vo} data-framer-name="Title Wrapper">
            <div className={`${s.c_1ew543g} ${s.rt}`}>
              <h2 className={`p-1ktddze`} dir="auto" style={{textAlign: "center", color: "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(10, 34, 107))"}}>
                講師
                <span style={{color: "var(--token-6b7381ba-6de4-49e1-a897-8666d0895cc7, rgb(207, 117, 39))"}}>
                  紹介
                </span>
              </h2>
            </div>
            <div className={`${s.c_zlnn2r} ${s.rt}`}>
              <p className={`p-1ijstdn`} dir="auto" style={{textAlign: "center", color: "var(--token-c7693201-4213-426e-a6de-0fbb44d0f402, rgb(68, 68, 68))"}}>
                IBを勝ち抜き、海外の有名大学に進学した講師たち
              </p>
            </div>
          </div>
          <div className={s.c_mzja5e} data-framer-name="Card Wrapper">
            <div className={s.c_lo1uxw}>
              <div className={s.c_14hvtb3_container}>
                <TeamCard mentor={getMentor("e-f")!} variant={{ desktop: "Desktop Team Card", tablet: "Secondary", phone: "Tertiary" }} />
              </div>
            </div>
          </div>
        </ScrollAppear>
      </div>
    </section>
  );
}
