import { Appear, TWEEN_04 } from "@/components/blogs/fx";
import { LeadForm, type Field, type LeadFormId } from "./LeadForm";
import s from "./ContactSection.module.css";

/**
 * Framer "Contact Section" of /faq (framer-5ufae2) and /contact (framer-7opse6): beige band with a centred title,
 * then the image beside the form (stacked below 1380px). Content appears from y 60, tween 0.4 s.
 * The two pages differ in title copy and width, the gap under the title, the image, the Name placeholder,
 * the email and message icon offsets and the Form Button variant on tablet and phone.
 */
const ICONS = {
  name: { src: "/framer/ZEF3knCk3U9AETVWMNMrrK40qwI.svg", width: 14, height: 16 },
  email: { src: "/framer/xeBKUjRc49YXMqtYpw1lEywTeeg.svg", width: 16, height: 16 },
  message: { src: "/framer/W0cGyM0IX4Y4pIiRMCxbVf0jhk.svg", width: 18, height: 16 },
};

const PAGES: Record<"faq" | "contact", { title: string; description: string; image: string; fields: Field[] }> = {
  faq: {
    title: "お探しの回答が見つかりませんでしたか？",
    description: "Contact us using the form and our staff will respond promptly.",
    image: "/framer/PQkXl2kmrnCFHIv7L3pFJjhhY.png",
    fields: [
      { kind: "text", name: "Name", label: "お名前", placeholder: "Your name", icon: { ...ICONS.name, pos: "center" } },
      { kind: "email", name: "Email ", label: "メールアドレス", placeholder: "Business email...", icon: { ...ICONS.email, pos: "faqEmail" } },
      { kind: "textarea", name: "Message", label: "お問い合わせ内容", placeholder: "Your text", icon: { ...ICONS.message, pos: "faqMessage" } },
    ],
  },
  contact: {
    title: "お問い合わせ",
    description: "お気軽にご連絡ください。実際のIBメンターが丁寧に対応致します。",
    image: "/framer/TUzjoPXx6MQpqYEbpbdNxRqHTso.png",
    fields: [
      { kind: "text", name: "Name", label: "お名前", placeholder: "Your Name", icon: { ...ICONS.name, pos: "center" } },
      { kind: "email", name: "Email ", label: "メールアドレス", placeholder: "Business email...", icon: { ...ICONS.email, pos: "center" } },
      { kind: "textarea", name: "Message", label: "お問い合わせ内容", placeholder: "Your text", icon: { ...ICONS.message, pos: "top24" } },
    ],
  },
};

export function ContactSection({ page }: { page: Extract<LeadFormId, "faq" | "contact"> }) {
  const p = PAGES[page];
  return (
    <section className={s.section} data-section="Contact Section">
      <div className={s.container} data-framer-name="Container">
        <Appear className={`${s.content} ${s[page]}`} y={60} transition={TWEEN_04} data-framer-name="Content">
          <div className={s.titleWrapper} data-framer-name="Title Wrapper">
            <div className={s.title} data-framer-name="Title">
              <h2 className={`p-1ktddze ${s.center}`}>{p.title}</h2>
            </div>
            <div className={s.rich} data-framer-name="Short Description 01">
              <p className={`p-1ijstdn ${s.center}`} dir="auto">
                {p.description}
              </p>
            </div>
          </div>
          <div className={s.row} data-framer-name="Image & Contact Wrapper">
            <div className={s.image}>
              <img className={s.img} src={p.image} alt="Image " decoding="async" loading="lazy" />
            </div>
            <LeadForm
              form={page}
              className={s.form}
              fields={p.fields}
              buttonTitle="送信する"
              buttonVariant={page === "faq" ? { desktop: "Default" } : { desktop: "Default", tablet: "Phone", phone: "Phone" }}
            />
          </div>
        </Appear>
      </div>
    </section>
  );
}
