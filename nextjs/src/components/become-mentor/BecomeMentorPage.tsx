import { Page } from "@/components/shell/Page";
import { Appear, TWEEN_04 } from "@/components/blogs/fx";
import { LeadForm, type Field } from "@/components/contact/LeadForm";
import s from "./BecomeMentorPage.module.css";

/**
 * Route /become-mentor. Framer page module qEsa5mKE*.mjs (framer-UQMLZ).
 *   Hero Section: title, intro, two images; appear y 60, tween 0.4 s.
 *   Contact Section: the application form in a beige card; appear y 60, tween 0.4 s.
 * Fields are Framer's, verbatim: the 在籍・卒業大学 input is Framer's "Phone number" (type number, placeholder
 * "Number"), and both selects are named "Location" with the template's options.
 */
const FIELDS: Field[] = [
  { kind: "text", name: "Name", label: "お名前", placeholder: "Your name", icon: { src: "/framer/ZEF3knCk3U9AETVWMNMrrK40qwI.svg", width: 14, height: 16, pos: "center" } },
  { kind: "email", name: "Email ", label: "メールアドレス", placeholder: "Business email...", icon: { src: "/framer/xeBKUjRc49YXMqtYpw1lEywTeeg.svg", width: 16, height: 16, pos: "center" } },
  { kind: "number", name: "Phone number", label: "在籍・卒業大学", placeholder: "Number", icon: { src: "/framer/egK3ov49pUaBflBoFLkjAitZycY.svg", width: 16, height: 16, pos: "center" } },
  { kind: "select", name: "Location", label: "得意科目・専門分野（例：Mathematics HL、Chemistry、EE など）", options: ["UI/UX Design", "Web Design", "Product Design"], labelName: "Subject" },
  { kind: "select", name: "Location", label: "IBや指導に関する経験・自己PR", options: ["4-5 years", "5-6 years", "6-7 years"], labelName: "Subject" },
];

export function BecomeMentorPage() {
  return (
    <Page>
      <section className={s.hero} data-section="Hero Section">
        <div className={s.container} data-framer-name="Container">
          <Appear className={s.heroContent} y={60} transition={TWEEN_04} data-framer-name="Content">
            <div className={s.titleWrapper} data-framer-name="Title Wrapper">
              <div className={s.rich}>
                <h1 className={`p-1da19g0 ${s.center}`}>メンター募集</h1>
              </div>
              <div className={`${s.rich} ${s.desc}`} data-framer-name="Short Description">
                <p className={`p-1ijstdn ${s.center}`} dir="auto">
                  Join our global IB teaching network, share your knowledge, and inspire thousands of students while earning from your expertise.
                </p>
              </div>
            </div>
            <div className={s.imageWrapper} data-framer-name="Image Wrapper">
              <div className={s.image1}>
                <img className={s.img} src="/framer/Qi5rNcD0C5NQQLTHaJwo5iWMyBw.webp" alt="Image " width={945} height={630} decoding="async" />
              </div>
              <div className={s.image2}>
                <img className={s.img} src="/framer/R3QUOq1ZYg189c60WO4O2EXY7BI.webp" alt="Image " width={512} height={377} decoding="async" />
              </div>
            </div>
          </Appear>
        </div>
      </section>
      <section className={s.contact} data-section="Contact Section">
        <div className={s.container2} data-framer-name="Container">
          <Appear className={s.contactContent} y={60} transition={TWEEN_04} data-framer-name="Content">
            <div className={s.card} data-framer-name="Contact Wrapper">
              <div className={s.cardTitle} data-framer-name="Title Wrapper">
                <div className={s.rich}>
                  <h2 className={`p-1ktddze ${s.center}`}>応募フォーム</h2>
                </div>
                <div className={s.rich} data-framer-name="Short Description">
                  <p className={`p-1ijstdn ${s.center}`} dir="auto">
                    以下のフォームにご記入のうえ送信してください。内容を確認のうえ、担当者よりご連絡いたします。
                  </p>
                </div>
              </div>
              <LeadForm
                form="become-mentor"
                className={s.form}
                fields={FIELDS}
                buttonTitle="応募する"
                buttonVariant={{ desktop: "Default", tablet: "Phone", phone: "Phone" }}
              />
            </div>
          </Appear>
        </div>
      </section>
    </Page>
  );
}
