"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import s from "./Navigation.module.css";

/**
 * Framer "Header " (layer name has a trailing space) > component "Navigation" (qa/framer-src/script_main.*.mjs:
 * `Navigation`, `Navigation Item`, `Navigation Trigger`, `Navigation Icon`, `All Page`).
 *
 * Desktop (>= 1380): logo + navy pill (ホーム / ページ trigger / ブログ + the "Quaternary" LINE button). Hovering
 *   ページ opens the `All Page` "Desktop V1" panel (550px, 7 links) below it: offset (43.6, 41) from the trigger,
 *   spring stiffness 600 / damping 40 / mass 0.5 from opacity 0 + scale 0.95 (transform origin top centre). It closes
 *   when the pointer leaves trigger + panel (Framer's floating "safe area") or on an outside click. Panel links use
 *   the `Navigation Item` hover swipe (tween 0.3s).
 * Tablet (768..1379.98) / Phone (<= 767.98): the header is fixed and navy; the orange hamburger toggles
 *   "Tablet Open" / "Phone Open" (Framer switches these variants instantly, duration 0). Open menu links are the
 *   `Navigation Item` "Secondary" variant: pressing slides the label 20px right (tween 0.3s).
 * Props contract: none. Do not change the export name.
 */

type NavLink = { label: string; href: string };

/** "All Page" Desktop V1 columns (Navigation Item Wrapper 01/02/03). */
const PANEL: NavLink[][] = [
  [
    { label: "ホーム", href: "/" },
    { label: "よくある質問", href: "/faq" },
    { label: "お問い合わせ", href: "/contact" },
  ],
  [
    { label: "メンター紹介", href: "/teams" },
    { label: "コース一覧", href: "/courses" },
  ],
  [
    { label: "メンターになる", href: "/become-mentor" },
    { label: "ブログ", href: "/blogs" },
  ],
];

/** "Links:  Essential  Pages" of the open tablet/phone menu. */
const MENU: NavLink[] = [
  { label: "ホーム", href: "/" },
  { label: "よくある質問", href: "/faq" },
  { label: "お問い合わせ", href: "/contact" },
  { label: "メンターになる", href: "/become-mentor" },
  { label: "コース一覧", href: "/courses" },
  { label: "指導者紹介", href: "/teams" },
  { label: "ブログ", href: "/blogs" },
];

const PANEL_SPRING = { type: "spring" as const, stiffness: 600, damping: 40, mass: 0.5 };
const CHEVRON_SPRING = { type: "spring" as const, stiffness: 600, damping: 40, mass: 1 };

function Chevron({ open }: { open: boolean }) {
  return (
    <div className={s.iconBox} data-framer-name={open ? "Open" : "Closed"}>
      <motion.div className={s.iconFrame} data-framer-name="Frame" initial={false} animate={{ rotate: open ? -180 : 0 }} transition={CHEVRON_SPRING}>
        <div className={s.iconSvg} data-framer-name="Icon" aria-hidden="true">
          <svg viewBox="0 0 14 14" width="100%" height="100%">
            <path
              d="M 3 5.5 L 7 9.5 L 11 5.5"
              fill="transparent"
              strokeWidth="2"
              stroke={open ? "var(--token-17474546-f0fd-442e-bce5-7d0f3321f71d, rgb(216, 128, 52))" : "var(--token-c7ef8dad-d4d1-4208-9575-8a58edab351f, rgb(244, 241, 234))"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

/** Framer "Navigation Item", default variant: two stacked labels that swap on hover. */
function PanelItem({ label, href, onClick }: NavLink & { onClick: () => void }) {
  return (
    <Link href={href} className={s.item} data-framer-name="Navigation Item" onClick={onClick}>
      <div className={s.itemWrap} data-framer-name="Text Wrapper">
        <div className={`${s.itemText} ${s.itemOut}`}>
          <p className="p-w4t77b">{label}</p>
        </div>
        <div className={`${s.itemText} ${s.itemIn}`}>
          <p className="p-w4t77b">{label}</p>
        </div>
      </div>
    </Link>
  );
}

const noopSubscribe = () => () => {};

function DesktopNav() {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; tx: number; tw: number; ty: number } | null>(null);
  const trig = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const measure = useCallback(() => {
    const r = trig.current?.getBoundingClientRect();
    if (!r) return;
    const left = r.left + window.scrollX + r.width / 2 + 43.625037235731725 - 275;
    const top = r.bottom + window.scrollY + 40.999985662754625;
    setPos({ left, top, tx: r.left + window.scrollX, tw: r.width, ty: r.top + window.scrollY });
  }, []);
  const show = useCallback(() => {
    window.clearTimeout(timer.current);
    measure();
    setOpen(true);
  }, [measure]);
  const keep = useCallback(() => window.clearTimeout(timer.current), []);
  const leave = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 40);
  }, []);

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      const t = e.target as Node;
      if (trig.current?.contains(t) || panel.current?.contains(t)) return;
      setOpen(false);
    };
    const resize = () => measure();
    document.addEventListener("pointerdown", down);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("pointerdown", down);
      window.removeEventListener("resize", resize);
    };
  }, [open, measure]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <nav className={s.desk} data-framer-name="Desktop">
      <div className={s.logoWrap} data-framer-name="Logo Wrapper">
        <Link href="/" className={s.logo} data-framer-name="Frame 8 (1)">
          <img src="/framer/9Kju7MX25XY8Zo8kTJ5LM33szIo.png" alt="" className={s.logoImg} />
        </Link>
      </div>
      <div className={s.pill} data-framer-name="Button & Menu Wrapper">
        <nav className={s.menuWrap} data-framer-name="Menu Wrapper">
          <div className={s.links} data-framer-name="Links">
            <div className={s.linkText}>
              <p className="p-w4t77b" style={{ textAlign: "center", color: "var(--token-c7ef8dad-d4d1-4208-9575-8a58edab351f, rgb(244, 241, 234))" }}>
                <Link className={`p-5wiz97 ${s.lnk}`} href="/">
                  ホーム
                </Link>
              </p>
            </div>
            <div
              ref={trig}
              className={s.trigger}
              data-framer-name="Trigger"
              onMouseEnter={show}
              onMouseLeave={leave}
              onClick={() => (open ? setOpen(false) : show())}
            >
              <div className={s.trigInner} data-framer-name={open ? "Open" : "Closed"}>
                <div className={s.linkText}>
                  <p
                    className="p-w4t77b"
                    style={{
                      textAlign: "left",
                      color: open
                        ? "var(--token-17474546-f0fd-442e-bce5-7d0f3321f71d, rgb(216, 128, 52))"
                        : "var(--token-c7ef8dad-d4d1-4208-9575-8a58edab351f, rgb(244, 241, 234))",
                    }}
                  >
                    ページ
                  </p>
                </div>
                <Chevron open={open} />
              </div>
            </div>
            <div className={s.linkText}>
              <p className="p-w4t77b" style={{ textAlign: "center", color: "var(--token-c7ef8dad-d4d1-4208-9575-8a58edab351f, rgb(244, 241, 234))" }}>
                <Link className={`p-5wiz97 ${s.lnk}`} href="/blogs">
                  ブログ
                </Link>
              </p>
            </div>
          </div>
        </nav>
        <div className={s.btnBox} data-framer-name="Button">
          <Button label="LINEで無料相談" href="https://lin.ee/EPTH4OI" variant="Quaternary" newTab />
        </div>
      </div>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <div className={s.floatLayer} key="all-page">
                {/* Safe area between the trigger and the panel, so the pointer can cross the 41px gap. */}
                <div
                  className={s.bridge}
                  style={{
                    left: Math.min(pos.left, pos.tx),
                    top: pos.ty,
                    width: Math.max(pos.left + 550, pos.tx + pos.tw) - Math.min(pos.left, pos.tx),
                    height: pos.top - pos.ty,
                  }}
                  onMouseEnter={keep}
                  onMouseLeave={leave}
                />
                <div style={{ position: "absolute", left: pos.left, top: pos.top }}>
                  <motion.div
                    ref={panel}
                    role="dialog"
                    className={s.panelBox}
                    initial={{ opacity: 0, scale: 0.95, transformPerspective: 1200 }}
                    animate={{ opacity: 1, scale: 1, transformPerspective: 1200 }}
                    exit={{ opacity: 0, scale: 0.95, transformPerspective: 1200 }}
                    transition={PANEL_SPRING}
                    style={{ transformOrigin: "50% 0%" }}
                    onMouseEnter={keep}
                    onMouseLeave={leave}
                  >
                    <div className={s.panel} data-framer-name="Desktop V1">
                      {PANEL.map((col, i) => (
                        <div key={i} className={s.col} data-framer-name={`Navigation Item Wrapper 0${i + 1}`}>
                          {col.map((l) => (
                            <PanelItem key={l.href} {...l} onClick={() => setOpen(false)} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </nav>
  );
}

function MobileNav({ kind }: { kind: "tablet" | "phone" }) {
  const [open, setOpen] = useState(false);
  const name = `${kind === "tablet" ? "Tablet" : "Phone"} ${open ? "Open" : "Closed"}`;
  const close = () => setOpen(false);
  // Close when the breakpoint changes away from this variant (Framer swaps the whole variant).
  useLayoutEffect(() => {
    const mq = window.matchMedia(kind === "tablet" ? "(min-width: 768px) and (max-width: 1379.98px)" : "(max-width: 767.98px)");
    const on = () => {
      if (!mq.matches) setOpen(false);
    };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [kind]);
  const logo = (
    <Link href="/" className={s.mLogo} data-framer-name="Frame 9" onClick={close}>
      <img src="/framer/hfw2vmJ29wD62I0DEYbzJcsGkY.png" alt="" className={s.logoImg} />
    </Link>
  );
  const icon = (
    <div
      className={s.burger}
      data-framer-name="Icon"
      tabIndex={0}
      role="button"
      aria-label={open ? "メニューを閉じる" : "メニューを開く"}
      aria-expanded={open}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((o) => !o);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((o) => !o);
        }
      }}
    >
      <div className={s.barBottom} data-framer-name="Bottom" />
      <div className={s.barTop} data-framer-name="Top" />
    </div>
  );
  return (
    <nav className={`${s.mob} ${kind === "tablet" ? s.tab : s.pho} ${open ? s.open : ""}`} data-framer-name={name}>
      <div className={s.mLogoWrap} data-framer-name="Logo Wrapper" data-border={open ? "true" : undefined} onClick={open ? close : undefined}>
        {kind === "tablet" ? (
          <>
            {logo}
            {icon}
          </>
        ) : (
          <>
            {icon}
            {logo}
          </>
        )}
      </div>
      {open && (
        <div className={s.menu} data-framer-name="Links:  Essential  Pages">
          {MENU.map((l) => (
            <Link key={l.href + l.label} href={l.href} className={s.mItem} data-framer-name="Secondary" onClick={close}>
              <div className={s.mItemWrap} data-framer-name="Text Wrapper">
                <div className={s.itemText}>
                  <p className="p-w4t77b">{l.label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export function Navigation() {
  return (
    <header className={s.header} data-section="Header " data-framer-name="Header ">
      <div className="hide-tablet hide-phone" style={{ display: "contents" }}>
        <div className={s.container} data-framer-name="Navigation">
          <DesktopNav />
        </div>
      </div>
      <div className="hide-desktop hide-phone" style={{ display: "contents" }}>
        <div className={s.container} data-framer-name="Navigation">
          <MobileNav kind="tablet" />
        </div>
      </div>
      <div className="hide-desktop hide-tablet" style={{ display: "contents" }}>
        <div className={s.container} data-framer-name="Navigation">
          <MobileNav kind="phone" />
        </div>
      </div>
    </header>
  );
}
