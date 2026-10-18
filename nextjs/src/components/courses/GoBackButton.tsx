import s from "./GoBackButton.module.css";

/**
 * Framer component "Go Back Button" (qa/framer-src/DsKqBh7hu.*.mjs, framer-ZANNJ), "Go Back" back to /courses.
 * "Go Back Button V1" (desktop) has the hover swipe: the arrow slides out left while its copy slides in from the
 * right, and the label drops out while its copy drops in from above (tween 0.4 s [0.44, 0, 0.56, 1]).
 * "Go Back Button V2" (tablet / phone) is the static one (cursor unset, no copies).
 */
export function GoBackButton({ href, label = "Go Back" }: { href: string; label?: string }) {
  return (
    <>
      <a className={`${s.btn} ${s.v1} hide-tablet hide-phone`} href={href} data-framer-name="Go Back Button V1">
        <div className={s.iconWrap} data-framer-name="Icon Wrapper">
          <div className={`${s.icon} ${s.iconIn}`} data-framer-name="Icon">
            <img src="/framer/nFW1oxPDtesy3dDYFZFQ9iJWWM.svg" alt="Icon" />
          </div>
          <div className={`${s.icon} ${s.iconOut}`} data-framer-name="Icon">
            <img src="/framer/nFW1oxPDtesy3dDYFZFQ9iJWWM.svg" alt="Icon" />
          </div>
        </div>
        <div className={s.titleWrap} data-framer-name="Title Wrapper">
          <div className={`${s.title} ${s.titleIn}`} data-framer-name="Title" aria-hidden="true">
            <p className="p-w4t77b">{label}</p>
          </div>
          <div className={`${s.title} ${s.titleOut}`} data-framer-name="Title">
            <p className="p-w4t77b">{label}</p>
          </div>
        </div>
      </a>
      <a className={`${s.btn} ${s.v2} hide-desktop`} href={href} data-framer-name="Go Back Button V2">
        <div className={s.iconWrap} data-framer-name="Icon Wrapper">
          <div className={s.icon} data-framer-name="Icon">
            <img src="/framer/nFW1oxPDtesy3dDYFZFQ9iJWWM.svg" alt="Icon" />
          </div>
        </div>
        <div className={s.titleWrap} data-framer-name="Title Wrapper">
          <div className={s.title} data-framer-name="Title">
            <p className="p-w4t77b">{label}</p>
          </div>
        </div>
      </a>
    </>
  );
}
