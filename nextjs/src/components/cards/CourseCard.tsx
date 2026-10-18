import type { Course } from "@/content/courses";
import { splitVariant } from "./variant";
import s from "./CourseCard.module.css";

/**
 * Framer component "Course Card" (qa/framer-src/MlJdimrhP.*.mjs, framer-8lzXB). Used on / (home builder imports it),
 * /courses and /teams/<slug>. Fields come from course.card; links to /courses/<slug>.
 *
 * Variants (Framer names): "Desktop Course Card" (default; the only one with the hover: image scale 1.2 and the
 * author / time / designation text turning navy, tween 0.4 s [0.44, 0, 0.56, 1]), "Secondary" (no hover, tighter
 * gaps, cursor unset) and "Tertiary" (Secondary with a fixed 300px image). Pass one name, or
 * { desktop, tablet?, phone? } for Framer's per-breakpoint swaps (a missing one falls back to desktop).
 * One DOM for every breakpoint: the variant only changes CSS custom properties.
 */
export type CourseCardVariant = string | { desktop: string; tablet?: string; phone?: string };

type V = "Desktop Course Card" | "Secondary" | "Tertiary";
const norm = (v: string): V => (v === "Secondary" || v === "Tertiary" ? v : "Desktop Course Card");
const KEY: Record<V, string> = { "Desktop Course Card": "main", Secondary: "sec", Tertiary: "ter" };

export function CourseCard({ course, variant, className }: { course: Course; variant?: CourseCardVariant; className?: string }) {
  const c = course.card;
  const { d, t, p } = splitVariant(variant, "Desktop Course Card");
  const vd = norm(d), vt = norm(t), vp = norm(p);
  const cls = [s.card, s[`d_${KEY[vd]}`], s[`t_${KEY[vt]}`], s[`p_${KEY[vp]}`], className].filter(Boolean).join(" ");
  return (
    <a href={`/courses/${course.slug}`} className={cls} data-framer-name={vd}>
      <div className={s.imageWrapper} data-framer-name="Image Wrapper">
        <div className={s.image}>
          {c?.image ? <img src={c.image.src} alt={c.image.alt || "Image"} decoding="async" /> : null}
        </div>
        <div className={s.price} data-framer-name="Price Wrapper">
          <div className={s.rt} data-framer-name="Price">
            <p className="p-w4t77b">{c?.price}</p>
          </div>
          <div className={s.rt}>
            <p className="p-w4t77b">{c?.priceUnit}</p>
          </div>
        </div>
      </div>
      <div className={s.content} data-framer-name="Content Wrapper">
        <div className={s.titleWrap} data-framer-name="Title Wrapper">
          <div className={s.authorRow} data-framer-name="Author Name Wrapper">
            <div className={s.iconWrap} data-framer-name="Icon Wrapper">
              <div className={s.icon12} data-framer-name="Icon">
                <img src="/framer/pQKu7umVPw5I91HR6P1zFZ1Drqs.svg" alt="Icon" />
              </div>
            </div>
            <div className={`${s.rt} ${s.author}`} data-framer-name="Author Name">
              <p className="p-1qag7qz">{c?.author}</p>
            </div>
          </div>
          <div className={`${s.rt} ${s.title}`} data-framer-name="Title">
            <h4 className="p-1goqrxy">{c?.title ?? course.title}</h4>
          </div>
        </div>
        <div className={s.meta} data-framer-name="Time & Designation ">
          <div className={s.metaItem} data-framer-name="Time Wrapper">
            <div className={s.icon18} data-framer-name="Icon">
              <img src="/framer/mRoERKiktpscAi8kHORJ9QYJpjs.svg" alt="Icon" />
            </div>
            <div className={`${s.rt} ${s.metaText}`} data-framer-name="Time">
              <p className="p-1qag7qz">{c?.time}</p>
            </div>
          </div>
          <div className={s.metaItem} data-framer-name="Designation Wrapper">
            <div className={s.icon18} data-framer-name="Icon">
              <img src="/framer/CYFDMaS1SdRAlObHsgwACYJUeo.svg" alt="Icon" />
            </div>
            <div className={`${s.rt} ${s.metaText}`} data-framer-name="Designation ">
              <p className="p-1qag7qz">{c?.designation}</p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
