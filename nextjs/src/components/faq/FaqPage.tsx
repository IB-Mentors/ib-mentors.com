import { Page } from "@/components/shell/Page";
import { Appear, HERO_SPRING, TWEEN_04 } from "@/components/blogs/fx";
import { ContactSection } from "@/components/contact/ContactSection";
import { FAQ_GROUPS } from "./faqData";
import { FaqTab } from "./FaqTab";
import s from "./FaqPage.module.css";

/**
 * Route /faq. Framer page module x44xsz38*.mjs (framer-5razR).
 *   Hero Section: title + intro (appear y 50, hero spring) and the full-width "Line" art pinned near the bottom.
 *   FAQ Section: `Faq Tab 01` and `Faq Tab 02` side by side (stacked below 1380px); appear y 60, tween 0.4 s.
 *   Contact Section: the shared contact block with the form.
 */
export function FaqPage() {
  return (
    <Page>
      <section className={s.hero} data-section="Hero Section">
        <div className={s.container} data-framer-name="Container">
          <Appear className={s.heroContent} y={50} transition={HERO_SPRING} data-framer-name="Content">
            <div className={s.titleWrapper} data-framer-name="Title Wrapper">
              <div className={s.rich}>
                <h1 className={`p-1da19g0 ${s.center}`}>よくあるご質問</h1>
              </div>
              <div className={s.rich} data-framer-name="Short Description">
                <p className={`p-1ijstdn ${s.center}`} dir="auto">
                  Explore our frequently asked questions, get clear answers, and enhance your learning experience with guidance from our experts.
                </p>
              </div>
            </div>
          </Appear>
        </div>
        <div className={s.line} data-framer-name="Line">
          <img className={s.lineImg} src="/framer/rBxxaSPzWFK8KWaXAwoRdWMiU.svg" alt="Line" width={1600} height={70} decoding="async" />
        </div>
      </section>
      <section className={s.faq} data-section="FAQ Section">
        <div className={s.container2} data-framer-name="Container">
          <Appear className={s.faqContent} y={60} transition={TWEEN_04} data-framer-name="Content">
            <div className={s.cardWrapper} data-framer-name="Card Wrapper">
              {FAQ_GROUPS.map((g) => (
                <div key={g.title} className={s.tabContainer}>
                  <FaqTab group={g} />
                </div>
              ))}
            </div>
          </Appear>
        </div>
      </section>
      <ContactSection page="faq" />
    </Page>
  );
}
