import Link from "next/link";
import s from "./Button.module.css";

/**
 * Framer component "Hero Button" (qa/framer-src/dunpihvNu.*.mjs, framer-AKvSF / framer-uvC9g), used on every route.
 * Variants exactly as Framer names them:
 *
 *   "Hero Button V1" | "Hero Button V2"           home Hero
 *   "Secondary V1" | "Secondary V2"               home, /404
 *   "Tertiary Button V1" | "Tertiary Button V2"   /courses/<slug> ("Enroll Today" card)
 *   "Quaternary"                                  navigation CTA (LINEで無料相談), every page
 *   "Quinary V1" | "Quinary V2"                   (defined, unused on the published site)
 *
 * V1 variants (and Quaternary) have the hover swipe: the hidden second "Title" (top -50px) and the second "Icon "
 * (left -30px) slide into place while the visible ones slide out (Framer layout animation, tween 0.4s
 * [0.44, 0, 0.56, 1]). V2 variants are static. Quaternary always links to the LINE account in a new tab
 * (Framer hard-codes that on the variant).
 * `variant` may also be per breakpoint: { desktop, tablet?, phone? } (missing ones fall back to desktop).
 */
export type ButtonVariant =
  | "Hero Button V1"
  | "Hero Button V2"
  | "Secondary V1"
  | "Secondary V2"
  | "Tertiary Button V1"
  | "Tertiary Button V2"
  | "Quaternary"
  | "Quinary V1"
  | "Quinary V2";

export type ButtonProps = {
  label: string;
  href: string;
  variant: ButtonVariant | { desktop: ButtonVariant; tablet?: ButtonVariant; phone?: ButtonVariant };
  /** Framer sets target="_blank" on the LINE links. */
  newTab?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const LINE = "https://lin.ee/EPTH4OI";

const VCLASS: Record<ButtonVariant, string> = {
  "Hero Button V1": s.heroV1,
  "Hero Button V2": s.heroV2,
  "Secondary V1": s.heroV1,
  "Secondary V2": s.heroV2,
  "Tertiary Button V1": s.tertV1,
  "Tertiary Button V2": s.tertV2,
  Quaternary: s.quat,
  "Quinary V1": s.quinV1,
  "Quinary V2": s.quinV2,
};

type OneProps = Omit<ButtonProps, "variant"> & { variant: ButtonVariant };

function One({ label, href, variant, newTab, className, style }: OneProps) {
  const isV2 = variant.endsWith("V2");
  const quat = variant === "Quaternary";
  const quin = variant.startsWith("Quinary");
  const link = quat ? LINE : href;
  const blank = quat || newTab;
  const icon = quin ? "/framer/SYb02aXDnk7oH8pdYfmLBitjh4g.svg" : "/framer/MUiB5BRMeNQWxB3nyflIZGeBI.svg";
  const cls = `${s.btn} ${VCLASS[variant]}${isV2 ? "" : ` ${s.swipe}`}${className ? ` ${className}` : ""}`;
  const inner = (
    <>
      <div className={s.titles} data-framer-name="Title Wrapper">
        {!isV2 && (
          <div className={`${s.title} ${s.titleIn}`} data-framer-name="Title">
            <p className="p-w4t77b">{label}</p>
          </div>
        )}
        <div className={`${s.title} ${s.titleOut}`} data-framer-name="Title">
          <p className="p-w4t77b">{label}</p>
        </div>
      </div>
      {!quat && (
        <div className={s.iconWrap} data-framer-name="Icon Wrapper">
          {!isV2 && <img className={`${s.icon} ${s.iconIn}`} data-framer-name="Icon " src={icon} alt="Icon " />}
          <img className={`${s.icon} ${s.iconOut}`} data-framer-name="Icon " src={icon} alt="Icon " />
        </div>
      )}
    </>
  );
  const common = { className: cls, style, "data-framer-name": variant };
  if (link.startsWith("/") && !blank) {
    return (
      <Link href={link} {...common}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={link} {...common} {...(blank ? { target: "_blank", rel: quat ? undefined : "noopener" } : {})}>
      {inner}
    </a>
  );
}

export function Button(props: ButtonProps) {
  const v = props.variant;
  if (typeof v === "string") return <One {...props} variant={v} />;
  const desk = v.desktop;
  const tab = v.tablet ?? desk;
  const ph = v.phone ?? desk;
  if (tab === desk && ph === desk) return <One {...props} variant={desk} />;
  // Framer renders one copy per breakpoint (ssr-variant + hidden-* classes); same here.
  const bps: [string, ButtonVariant][] = [
    ["desktop", desk],
    ["tablet", tab],
    ["phone", ph],
  ];
  const groups = [...new Set([desk, tab, ph])].map((variant) => ({
    variant,
    hide: bps
      .filter(([, x]) => x !== variant)
      .map(([bp]) => `hide-${bp}`)
      .join(" "),
  }));
  return (
    <>
      {groups.map((g) => (
        <div key={g.variant} className={g.hide} style={{ display: "contents" }}>
          <One {...props} variant={g.variant} />
        </div>
      ))}
    </>
  );
}
