import { Page } from "@/components/shell/Page";
import { Button } from "@/components/ui/Button";
import { Appear, SECTION_APPEAR } from "@/components/courses/Appear";
import s from "./NotFoundPage.module.css";

/**
 * Route /404 and every unmatched URL (src/app/not-found.tsx, status 404 like Framer). Framer page module
 * RnX3oBiD*.mjs (framer-gDIrl): one white Hero Section with the orange "404" (350 / 60 / 40px, line height 0.76em),
 * "Looks like here is nothing!" and the ホームに戻る button home (Secondary V1 with the hover swipe on desktop,
 * Secondary V2 elsewhere). The content rises in with the section appear tween.
 */
export function NotFoundPage() {
  return (
    <Page>
      <section className={s.hero} data-section="Hero Section" data-framer-name="Hero Section">
        <div className={s.container} data-framer-name="Container">
          <Appear preset={SECTION_APPEAR} className={s.content} name="Content">
            <div className={s.wrap} data-framer-name="Image & Text Wrapper">
              <div className={s.rt}>
                <h1 className={s.code} dir="auto">
                  404
                </h1>
              </div>
              <div className={s.rt} data-framer-name="Text">
                <p className={`p-1ijstdn ${s.text}`} dir="auto">
                  Looks like here is nothing!
                </p>
              </div>
            </div>
            <div className={s.button} data-framer-name="Button">
              <Button label="ホームに戻る" href="/" variant={{ desktop: "Secondary V1", tablet: "Secondary V2", phone: "Secondary V2" }} />
            </div>
          </Appear>
        </div>
      </section>
    </Page>
  );
}
