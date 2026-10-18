import type { Mentor } from "@/content/teams";
import { splitVariant } from "./variant";
import s from "./TeamCard.module.css";

/**
 * Framer component "Team Card" (qa/framer-src/Zyjm7l3ce.*.mjs, framer-5ThnH). Used on / (home builder imports it)
 * and /teams. Links to /teams/<slug>.
 *
 * Variants (Framer names): "Desktop Team Card" (default; hover turns the university pill orange with white text,
 * tween 0.4 s [0.44, 0, 0.56, 1]), "Secondary" (no hover, cursor unset) and "Tertiary" (Secondary with the pill row
 * not centred by translateX: left 0, padding 0 10px, wraps). Pass one name or { desktop, tablet?, phone? }.
 */
export type TeamCardVariant = string | { desktop: string; tablet?: string; phone?: string };

type V = "Desktop Team Card" | "Secondary" | "Tertiary";
const norm = (v: string): V => (v === "Secondary" || v === "Tertiary" ? v : "Desktop Team Card");
const KEY: Record<V, string> = { "Desktop Team Card": "main", Secondary: "sec", Tertiary: "ter" };

export function TeamCard({ mentor, variant, className }: { mentor: Mentor; variant?: TeamCardVariant; className?: string }) {
  const { d, t, p } = splitVariant(variant, "Desktop Team Card");
  const vd = norm(d), vt = norm(t), vp = norm(p);
  const cls = [s.card, s[`d_${KEY[vd]}`], s[`t_${KEY[vt]}`], s[`p_${KEY[vp]}`], className].filter(Boolean).join(" ");
  return (
    <a href={`/teams/${mentor.slug}`} className={cls} data-framer-name={vd}>
      <div className={s.image}>
        {mentor.image ? <img src={mentor.image.src} alt={mentor.image.alt} decoding="async" /> : null}
      </div>
      <div className={s.cat} data-framer-name="Categoty Wrapper">
        <div className={s.pill} data-framer-name="Designation Wrapper">
          <div className={`${s.rt} ${s.designation}`} data-framer-name="Designation">
            <p className="p-1qag7qz">{mentor.designation}</p>
          </div>
        </div>
      </div>
      <div className={s.nameWrap} data-framer-name="Author Name Wrapper">
        <div className={`${s.rt} ${s.name}`} data-framer-name="Author Name">
          <h4 className="p-1goqrxy">{mentor.name}</h4>
        </div>
      </div>
      <div className={s.linear} data-framer-name="linear" />
    </a>
  );
}
