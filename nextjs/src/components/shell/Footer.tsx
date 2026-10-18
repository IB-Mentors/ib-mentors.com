import Link from "next/link";
import { Appear } from "@/components/ui/Appear";
import { FooterDate } from "./FooterDate";
import s from "./Footer.module.css";

/**
 * Framer "Footer Section" > component "Footer" (qa/framer-src/script_main.*.mjs: `Footer` framer-tfvoD, `Footer pages
 * Link`, `Footer Social Link`, `Footer Button`, `Time & Date`). The Desktop / Tablet / Phone variants share one DOM
 * here; their differences are media queries in Footer.module.css (Framer: framer-v-5ddg99 / 18wk9xl / yrxn6u).
 * Copy verbatim, including the template's placeholder `mailto: info@elearning.com`, the LINE label pointing at
 * instagram.com, the Instagram label with no link and 会社概要 resolving to "/" (repo README "Known issues").
 * Motion: "Content" rises 50px (spring stiffness 300 / damping 60 / mass 1.2, delay 0.2, once, threshold 0);
 * the two "Image Bg 2" layers rise 10px / 20px (tween 0.4s, threshold 0.5) on desktop only; hover colours (desktop
 * variants only): page and social links to #d88034 (tween 0.3s), the contact button to #cf7527 (spring 0.4s).
 * Props contract: none. Do not change the export name.
 */

const PAGES = [
  { label: "ホーム", href: "/" },
  { label: "メンター紹介", href: "/teams" },
  { label: "会社概要", href: "/" },
  { label: "コース一覧", href: "/courses" },
  { label: "ブログ", href: "/blogs" },
  { label: "お問い合わせ", href: "/contact" },
];

const CONTENT_SPRING = { type: "spring" as const, stiffness: 300, damping: 60, mass: 1.2, delay: 0.2 };
const IMG_TWEEN = { type: "tween" as const, duration: 0.4, ease: [0.44, 0, 0.56, 1] as [number, number, number, number], delay: 0 };
const SOCIAL_ICON = "/framer/ThnKaQCXZxyH7xZSeshA0VPxQ7o.svg";
const LOGO_STRIP = "/framer/Tzai5dmVx2sidbQwVqYYrufKgxE.png";

function StripImage({ className }: { className: string }) {
  return (
    <Link href="/" className={className}>
      <div className={s.fill}>
        <img alt="Image" loading="lazy" decoding="async" src={LOGO_STRIP} className={s.cover} />
      </div>
    </Link>
  );
}

export function Footer() {
  return (
    <footer className={s.section} data-section="Footer Section" data-framer-name="Footer Section">
      <div className={s.box}>
        <footer className={s.footer} data-framer-name="Footer">
          <div className={s.container} data-framer-name="Container">
            <Appear className={s.content} data-framer-name="Content" from={{ opacity: 0, y: 50 }} transition={CONTENT_SPRING}>
              <div className={s.top} data-framer-name="Top Wrapper">
                <div className={s.titleContact} data-framer-name="Title & Contact Wrapper">
                  <div className={`${s.full} ${s.rt}`} data-framer-name="Title">
                    <h3 className="p-qapw0k" dir="auto" style={{ color: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))" }}>
                      メンターと共に
                      <br />
                      悔いのないIBライフを
                    </h3>
                  </div>
                  <div className={s.contactWrap} data-framer-name="Contact Wrapper">
                    <div className={s.auto}>
                      <Link href="/contact" className={s.fbtn} data-framer-name="Dekstop">
                        <div className={s.icon24} data-framer-name="Icon">
                          <div className={s.fill}>
                            <img alt="Icon" loading="lazy" decoding="async" src="/framer/sPBtgpeaJEnDHI7nPSUs0sYkEA.svg" className={s.contain} />
                          </div>
                        </div>
                        <div className={`${s.pre} ${s.rt}`} data-framer-name="Title">
                          <p className="p-ztkeh" dir="auto">
                            お問い合わせ
                          </p>
                        </div>
                      </Link>
                    </div>
                    <div className={s.emailLoc} data-framer-name="Email & Location">
                      <div className={`${s.full} ${s.rt}`} data-framer-name="Email">
                        <p className="p-1ijstdn" dir="auto" style={{ color: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))" }}>
                          <a className={`p-id40al ${s.lnk}`} href="mailto: info@elearning.com" target="_blank">
                            info@ib-mentors.com
                          </a>
                        </p>
                      </div>
                      <div className={`${s.location} ${s.rt}`} data-framer-name="Location">
                        <p className="p-1ijstdn" dir="auto" style={{ color: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))" }}>
                          〒156-0043 東京都世田谷区松原６丁目２９－７
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={s.menu} data-framer-name="Menu Wrapper">
                  <div className={s.menuCol} data-framer-name="Title & Menu Wrapper">
                    <div className={`${s.full} ${s.rt}`} data-framer-name="Title">
                      <p className="p-1ijstdn" style={{ color: "var(--token-e29f80cc-7c19-42a6-a7c7-b923c17868bb, rgba(255, 255, 255, 0.7))" }}>
                        Navigation
                      </p>
                    </div>
                    <div className={s.linkList} data-framer-name="Links Wrapper">
                      {PAGES.map((p) => (
                        <div key={p.label} className={s.auto}>
                          <Link href={p.href} className={s.pageLink} data-framer-name="Footer pages Link">
                            <div className={`${s.pre} ${s.rt}`}>
                              <h5 className="p-1q957ix" dir="auto">
                                {p.label}
                              </h5>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={s.menuCol} data-framer-name="Title & Menu Wrapper">
                    <div className={`${s.full} ${s.rt}`} data-framer-name="Title">
                      <p className="p-1ijstdn" style={{ color: "var(--token-e29f80cc-7c19-42a6-a7c7-b923c17868bb, rgba(255, 255, 255, 0.7))" }}>
                        Contact
                      </p>
                    </div>
                    <div className={s.linkList} data-framer-name="Links wrapper">
                      <div className={s.socialBox}>
                        <a className={s.social} data-framer-name="Footer Social Link" href="https://www.instagram.com/" target="_blank">
                          <div className={`${s.pre} ${s.rt}`}>
                            <h5 className="p-1q957ix">LINE</h5>
                          </div>
                          <div className={s.icon24} data-framer-name="Icon">
                            <div className={s.fill}>
                              <img alt="Icon" loading="lazy" decoding="async" src={SOCIAL_ICON} className={s.contain} />
                            </div>
                          </div>
                        </a>
                      </div>
                      <div className={s.socialBox}>
                        <a className={s.social} data-framer-name="Footer Social Link">
                          <div className={`${s.pre} ${s.rt}`}>
                            <h5 className="p-1q957ix">Instagram</h5>
                          </div>
                          <div className={s.icon24} data-framer-name="Icon">
                            <div className={s.fill}>
                              <img alt="Icon" loading="lazy" decoding="async" src={SOCIAL_ICON} className={s.contain} />
                            </div>
                          </div>
                        </a>
                      </div>
                      <a className={s.mail} data-framer-name="Footer Social Link" href="mailto: info@elearning.com" target="_blank">
                        <div className={`${s.pre} ${s.rt}`}>
                          <h5 className="p-1q957ix" dir="auto" style={{ color: "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))" }}>
                            Email
                          </h5>
                        </div>
                        <div className={s.icon24} data-framer-name="Icon">
                          <div className={s.fill}>
                            <img alt="Icon" loading="lazy" decoding="async" src={SOCIAL_ICON} className={s.contain} />
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className={s.bottom} data-framer-name="Copy Right & image">
                <div className={s.copyRow} data-framer-name="Copy Right Wrapper">
                  <div className={`${s.copy} ${s.rt}`} data-framer-name="Title">
                    <p className="p-1ijstdn" dir="auto">
                      © 2026 IB Mentors. All Rights Reserved.
                    </p>
                  </div>
                  <div className={s.auto}>
                    <FooterDate />
                  </div>
                </div>
                <div className={s.images} data-framer-name="Image Wrapper ">
                  <div className={s.bg1} data-framer-name="Image Bg 1">
                    <StripImage className={s.strip} />
                  </div>
                  <Appear className={`${s.bg2} ${s.bg2a}`} data-framer-name="Image Bg 2" x="-50%" from={{ opacity: 0, y: 10 }} transition={IMG_TWEEN} amount={0.5}>
                    <StripImage className={`${s.strip} ${s.stripMid}`} />
                  </Appear>
                  <Appear className={`${s.bg2} ${s.bg2b}`} data-framer-name="Image Bg 2" x="-50%" from={{ opacity: 0, y: 20 }} transition={IMG_TWEEN} amount={0.5}>
                    <StripImage className={s.strip} />
                  </Appear>
                </div>
              </div>
            </Appear>
          </div>
        </footer>
      </div>
    </footer>
  );
}
