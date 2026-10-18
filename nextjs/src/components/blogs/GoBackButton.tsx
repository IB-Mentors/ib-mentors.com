import Link from "next/link";
import s from "./GoBackButton.module.css";

/**
 * Framer component "Go Back Button" (DsKqBh7hu*.mjs, framer-ZANNJ).
 *   "Go Back Button V1" (desktop): two icons and two labels. On hover the hidden label drops in from above while the
 *     visible one slides out below, and the hidden arrow comes in from the right while the visible one leaves to the
 *     left (Framer layout swap, tween 0.4 s [0.44, 0, 0.56, 1]).
 *   "Go Back Button V2" (tablet, phone): one icon, one label, no hover.
 * The label is Framer's "Go Back " with its trailing space (white-space: pre).
 */
const ICON = "/framer/nFW1oxPDtesy3dDYFZFQ9iJWWM.svg";

export function GoBackButton({ href = "/blogs", title = "Go Back " }: { href?: string; title?: string }) {
  return (
    <Link href={href} className={s.btn} data-framer-name="Go Back Button V1">
      <div className={s.iconWrapper} data-framer-name="Icon Wrapper">
        <div className={`${s.icon} ${s.iconIn}`} data-framer-name="Icon">
          <img className={s.img} src={ICON} alt="Icon" width={15} height={9} decoding="async" />
        </div>
        <div className={`${s.icon} ${s.iconOut}`} data-framer-name="Icon">
          <img className={s.img} src={ICON} alt="Icon" width={15} height={9} decoding="async" />
        </div>
      </div>
      <div className={s.titleWrapper} data-framer-name="Title Wrapper">
        <div className={`${s.title} ${s.titleIn}`} data-framer-name="Title">
          <p className="p-w4t77b">{title}</p>
        </div>
        <div className={`${s.title} ${s.titleOut}`} data-framer-name="Title">
          <p className="p-w4t77b">{title}</p>
        </div>
      </div>
    </Link>
  );
}
