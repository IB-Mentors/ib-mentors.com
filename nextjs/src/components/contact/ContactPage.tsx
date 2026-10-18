import { Page } from "@/components/shell/Page";
import { Appear, HERO_SPRING, TWEEN_04 } from "@/components/blogs/fx";
import { LINE_URL } from "@/lib/site";
import { ContactSection } from "./ContactSection";
import { NestedLink } from "./NestedLink";
import s from "./ContactPage.module.css";

/**
 * Route /contact. Framer page module iVuZwDpI*.mjs (framer-uTihQ).
 *   Hero Section: title, two-line intro, two images (the first mirrored, rotateY 180deg); appear y 50, hero spring.
 *   Contact Card Section: LINE card (whole card and its nested link go to LINE_URL), email card, hours card.
 *     Framer's template leftovers were fixed on 19 Oct 2026: the nested link pointed at the bare https://line.me and
 *     the opening-hours lines were wrapped in placeholder mailto links (now plain text). Appear y 60, tween 0.4 s.
 *   Contact Section: the shared contact block with the form.
 */
export function ContactPage() {
  return (
    <Page>
      <section className={s.hero} data-section="Hero Section">
        <div className={s.container} data-framer-name="Container">
          <Appear className={s.heroContent} y={50} transition={HERO_SPRING} data-framer-name="Content">
            <div className={s.titleWrapper} data-framer-name="Title Wrapper">
              <div className={s.rich}>
                <h1 className={`p-1da19g0 ${s.center}`}>お問い合わせ</h1>
              </div>
              <div className={s.rich} data-framer-name="Short Description">
                <p className={`p-1ijstdn ${s.center}`} dir="auto">
                  IBの卒業生に気軽に無料でご質問いただけます。
                </p>
                <p className={`p-1ijstdn ${s.center}`} dir="auto">
                  大学のことや少し不安なことなど、あなたの悩みをお聞かせください。
                </p>
              </div>
            </div>
            <div className={s.imageWrapper} data-framer-name="Image Wrapper">
              <div className={s.image1} style={{ transform: "rotateY(180deg)" }}>
                <img className={s.img} src="/framer/7kZgS9uFIadbPTtDD690Sn92mw.webp" alt="Image " width={1200} height={728} decoding="async" />
              </div>
              <div className={s.image2}>
                <img className={s.img} src="/framer/jZbD2SbEbqo20HdLuzmrQY0sw.png" alt="Image " width={2048} height={2048} decoding="async" />
              </div>
            </div>
          </Appear>
        </div>
      </section>
      <section className={s.cardsSection} data-section="Contact Card Section">
        <div className={s.container2} data-framer-name="Container">
          <Appear className={s.cardsContent} y={60} transition={TWEEN_04} data-framer-name="Content">
            <div className={s.cardWrapper} data-framer-name="Card Wrapper">
              <a className={`${s.card} ${s.cardLine}`} data-framer-name="Contact Card" href={LINE_URL} target="_blank">
                <div className={`${s.textIcon} ${s.textIconLine}`} data-framer-name="Text & Icon Wrapper">
                  <div className={s.textWrapper} data-framer-name="Text Wrapper">
                    <div className={s.mailWrapper} data-framer-name="Mail Wrapper 01">
                      <div className={s.text} data-framer-name="Text">
                        <p className={`p-1ijstdn ${s.center}`} dir="auto">
                          <NestedLink href={LINE_URL} target="_blank" className={`p-1ajtkdr ${s.link}`}>
                            LINEにて無料相談を受け付けています。まずはお気軽にメッセージをお送りください。
                          </NestedLink>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`${s.iconWrapper} ${s.iconWrapperLine}`} data-framer-name="Icon Wrapper">
                    <div className={s.icon} data-framer-name="Icon">
                      <img className={s.iconImg} src="/framer/l45TxfRxDSPbff1zZy31Of8Os3I.svg" alt="Icon" width={54} height={54} />
                    </div>
                  </div>
                </div>
                <div className={s.rich} data-framer-name="Title">
                  <h4 className={`p-1goqrxy ${s.center}`}>LINE相談（無料）</h4>
                </div>
              </a>
              <div className={`${s.card} ${s.cardMail}`} data-framer-name="Contact Card">
                <div className={s.textIcon} data-framer-name="Text & Icon Wrapper">
                  <div className={`${s.textWrapper} ${s.textWrapper2}`} data-framer-name="Text Wrapper">
                    <div className={s.mailWrapper} data-framer-name="Mail Wrapper 01">
                      <div className={s.text} data-framer-name="Text">
                        <p className={`p-1ijstdn ${s.center} ${s.white}`} dir="auto">
                          <a className={`p-fq3lch ${s.link}`} href="mailto:info@ib-mentors.com" target="_blank" rel="">
                            info@ib-mentors.com
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className={`${s.mailWrapper} ${s.mailWrapper2}`} data-framer-name="Mail Wrapper 02">
                      <div className={s.text} data-framer-name="Text">
                        <p className={`p-1ijstdn ${s.center} ${s.white}`} dir="auto">
                          <a className={`p-fq3lch ${s.link}`} href="mailto:support@ib-mentors.com" target="_blank" rel="">
                            support@ib-mentors.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`${s.iconWrapper} ${s.iconWrapperMail}`} data-framer-name="Icon Wrapper">
                    <div className={s.icon} data-framer-name="Icon">
                      <img className={s.iconImg} src="/framer/hd2ZKOd3XPkVCewHNvEFGH2NQyg.svg" alt="Icon" width={54} height={54} />
                    </div>
                  </div>
                </div>
                <div className={s.rich} data-framer-name="Title">
                  <h4 className={`p-1goqrxy ${s.center} ${s.white}`}>メールアドレス</h4>
                </div>
              </div>
              <div className={`${s.card} ${s.cardHours}`} data-framer-name="Contact Card">
                <div className={s.textIcon} data-framer-name="Text & Icon Wrapper">
                  <div className={`${s.textWrapper} ${s.textWrapper2}`} data-framer-name="Text Wrapper">
                    <div className={s.mailWrapper} data-framer-name="Mail Wrapper 01">
                      <div className={s.text} data-framer-name="Text">
                        <p className={`p-1ijstdn ${s.center} ${s.muted}`} dir="auto">
                          <span className="p-6bdd8r">
                            毎日：7:00 〜 22:00（日本時間）
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className={`${s.mailWrapper} ${s.mailWrapper2}`} data-framer-name="Mail Wrapper 02">
                      <div className={s.text} data-framer-name="Text">
                        <p className={`p-1ijstdn ${s.center} ${s.muted}`} dir="auto">
                          <span className="p-6bdd8r">
                            土・日・祝：対応可
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`${s.iconWrapper} ${s.iconWrapperHours}`} data-framer-name="Icon Wrapper">
                    <div className={s.icon} data-framer-name="Icon">
                      <img className={s.iconImg} src="/framer/ZkJMYDeL8LAPRWFaRnw4ak3axk.svg" alt="Icon" width={54} height={54} />
                    </div>
                  </div>
                </div>
                <div className={s.rich} data-framer-name="Title">
                  <h4 className={`p-1goqrxy ${s.center} ${s.white}`}>対応時間</h4>
                </div>
              </div>
            </div>
          </Appear>
        </div>
      </section>
      <ContactSection page="contact" />
    </Page>
  );
}
