import { Page } from "@/components/shell/Page";
import { Appear, HERO_SPRING, TWEEN_04 } from "./fx";
import { BlogGrid } from "./BlogGrid";
import s from "./BlogsPage.module.css";

/**
 * Route /blogs. Framer page module yMu5HGDW*.mjs (framer-FFyje).
 *   Hero Section: title + intro, two images; Content appears from y 50 with the hero spring.
 *   Blogs Section: `Blog Card V2` grid + Load More; Content appears from y 60, tween 0.4 s.
 */
export function BlogsPage() {
  return (
    <Page>
      <section className={s.hero} data-section="Hero Section">
        <div className={s.container} data-framer-name="Container">
          <Appear className={s.heroContent} y={50} transition={HERO_SPRING} data-framer-name="Content">
            <div className={s.titleWrapper} data-framer-name="Title Wrapper">
              <div className={s.richText}>
                <h1 className={`p-1da19g0 ${s.center}`}>ブログ・お役立ち情報</h1>
              </div>
              <div className={s.richText} data-framer-name="Short Description">
                <p className={`p-1ijstdn ${s.center}`} dir="auto">
                  Explore our blog, gain actionable insight, and stay ahead in learning while discovering tips from IB experts worldwide.
                </p>
              </div>
            </div>
            <div className={s.imageWrapper} data-framer-name="Image Wrapper">
              <div className={s.image1}>
                <img className={s.img} src="/framer/TSpivqxF4hXO3qO5aAf1HUh4vwE.jpg" alt="Image " width={1717} height={900} decoding="async" />
              </div>
              <div className={s.image2}>
                <img className={s.img} src="/framer/itd35Zu0lf3nbVeUQ0hmz4i4qCc.png" alt="Image " width={700} height={700} decoding="async" />
              </div>
            </div>
          </Appear>
        </div>
      </section>
      <section className={s.blogs} data-section="Blogs Section">
        <div className={s.container2} data-framer-name="Container">
          <Appear className={s.blogsContent} y={60} transition={TWEEN_04} data-framer-name="Content">
            <div className={s.cardWrapper} data-framer-name="Card Wrapper">
              <BlogGrid />
            </div>
          </Appear>
        </div>
      </section>
    </Page>
  );
}
