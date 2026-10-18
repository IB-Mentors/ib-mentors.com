import { Appear, HERO_APPEAR } from "./Appear";
import s from "./PageHero.module.css";

/**
 * The inner-page "Hero Section" of /courses, /teams and /courses/<slug> (identical in the three page modules):
 * title (preset 1da19g0, navy, centred) + short description (preset 1ijstdn, #444, centred) rising in with the
 * hero appear spring, and the decorative "Line" (rBxxaSPzWFK8KWaXAwoRdWMiU.svg) pinned to the section bottom.
 * `detail` = the course page's wider title wrapper (800 / 750 / 400px, description max 575px) instead of 555px.
 */
export function PageHero({ title, description, detail = false }: { title: string; description: string; detail?: boolean }) {
  return (
    <section className={s.hero} data-section="Hero Section" data-framer-name="Hero Section">
      <div className={s.container} data-framer-name="Container">
        <Appear preset={HERO_APPEAR} className={s.content} name="Content">
          <div className={`${s.titleWrap} ${detail ? s.detail : ""}`} data-framer-name="Title Wrapper">
            <div className={s.rt}>
              <h1 className={`p-1da19g0 ${s.title}`}>{title}</h1>
            </div>
            <div className={`${s.rt} ${s.desc}`} data-framer-name="Short Description">
              <p className={`p-1ijstdn ${s.descText}`} dir="auto">
                {description}
              </p>
            </div>
          </div>
        </Appear>
      </div>
      <HeroLine />
    </section>
  );
}

/** Framer "Line": full-width, aspect 21.5625, absolutely placed 16 / 40 / 30px above the section bottom. */
export function HeroLine() {
  return (
    <div className={s.line} data-framer-name="Line">
      <img src="/framer/rBxxaSPzWFK8KWaXAwoRdWMiU.svg" alt="Line" width={1600} height={70} decoding="async" />
    </div>
  );
}
