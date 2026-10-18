"use client";
/**
 * Framer component "Form Button" (KQ0N_aKll*.mjs, framer-f4Pjl). Variants:
 *   Default  dark pill, label + white icon disc. Hover (tween 0.4 s [0.44, 0, 0.56, 1]): the hidden label drops in
 *            from above (it reads "Submit Now" at rest and takes the button title while hovered), the visible one
 *            slides out below; the hidden arrow comes in from the left and the visible one leaves to the right.
 *   Phone    Default without hover (used on tablet and phone by /contact and /become-mentor).
 *   Loading  181 x 54, rotating conic spinner masked by Framer's ring SVG (1 s linear loop).
 *   Success  181 x 54, "Thank you".
 *   Error    54 tall, translucent red, "Something went wrong".
 *   Disabled 181 x 54 at 50 % opacity (Framer never shows it on these forms).
 */
import { useState } from "react";
import { useBreakpoint } from "@/components/blogs/fx";
import s from "./FormButton.module.css";

export type FormState = "incomplete" | "pending" | "success" | "error";
type Base = "Default" | "Phone";

const ICON = "/framer/MUiB5BRMeNQWxB3nyflIZGeBI.svg";

export function FormButton({
  title,
  state,
  variant = { desktop: "Default" },
}: {
  title: string;
  state: FormState;
  variant?: { desktop: Base; tablet?: Base; phone?: Base };
}) {
  const bp = useBreakpoint();
  const [hover, setHover] = useState(false);
  const base = variant[bp] ?? variant.desktop;
  const name =
    state === "pending" ? "Loading" : state === "success" ? "Success" : state === "error" ? "Error" : base;
  const hovered = hover && name === "Default";
  const cls = [s.btn, name === "Loading" || name === "Success" ? s.wide : "", name === "Error" ? s.error : "", hovered ? s.hover : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="submit"
      className={cls}
      data-framer-name={name}
      aria-busy={name === "Loading" || undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {name !== "Loading" && (
        <div className={s.titleWrapper} data-framer-name="Title Wrapper">
          {(name === "Default" || name === "Phone") && (
            <div className={`${s.title} ${s.titleIn}`}>
              <p className="p-w4t77b">{hovered ? title : "Submit Now"}</p>
            </div>
          )}
          <div className={`${s.title} ${s.titleOut}`}>
            <p className="p-w4t77b">{name === "Success" ? "Thank you" : name === "Error" ? "Something went wrong" : title}</p>
          </div>
        </div>
      )}
      {(name === "Default" || name === "Phone") && (
        <div className={s.iconWrapper} data-framer-name="Icon Wrapper">
          <div className={`${s.icon} ${s.iconIn}`} data-framer-name="Icon">
            <img className={s.img} src={ICON} alt="Icon" width={15} height={9} />
          </div>
          <div className={`${s.icon} ${s.iconOut}`} data-framer-name="Icon">
            <img className={s.img} src={ICON} alt="Icon" width={15} height={9} />
          </div>
        </div>
      )}
      {name === "Loading" && (
        <div className={s.spinner} data-framer-name="Spinner">
          <div className={s.conic} data-framer-name="Conic">
            <div className={s.rounding} data-framer-name="Rounding" />
          </div>
        </div>
      )}
    </button>
  );
}
