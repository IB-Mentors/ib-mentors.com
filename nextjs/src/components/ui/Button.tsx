/**
 * STUB with a fixed props contract (shell builder fills in the visuals). Framer component "Hero Button"
 * (qa/framer-src/dunpihvNu.*.mjs, framer-uvC9g), used on every route. Variants exactly as Framer names them:
 *
 *   "Hero Button V1" | "Hero Button V2"           home Hero
 *   "Secondary V1" | "Secondary V2"               home, /404
 *   "Tertiary Button V1" | "Tertiary Button V2"   /courses/<slug> ("Enroll Today" card)
 *   "Quaternary"                                  navigation CTA (LINEで無料相談), every page
 *   "Quinary V1" | "Quinary V2"                   (defined, unused on the published site)
 *
 * V1 variants have the two-label swipe hover (two "Title" layers + two icons); V2 variants are the static ones.
 * `variant` may also be per breakpoint: { desktop, tablet?, phone? } (missing ones fall back to desktop).
 * Links: internal hrefs as absolute paths ("/contact"), external links keep Framer's target/rel.
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

export function Button({ label, href, newTab, className, style }: ButtonProps) {
  return (
    <a href={href} className={className} style={style} {...(newTab ? { target: "_blank", rel: "noopener" } : {})}>
      {label}
    </a>
  );
}
