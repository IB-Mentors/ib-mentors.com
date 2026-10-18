"use client";
/**
 * Shared motion helpers for the blogs, FAQ, contact and become-mentor pages.
 *
 * Appear: Framer's style appear effect (`__framer__styleAppearEffectEnabled`, `__framer__enter` ->
 * `__framer__animate`, `__framer__threshold: 0`, `__framer__animateOnce`). The SSR markup carries the enter state
 * inline (opacity 0 + translateY, exactly as Framer's SSR HTML does) and the element animates to rest the first time
 * any pixel of it enters the viewport.
 *
 * useBreakpoint: this site's breakpoints (desktop >= 1380, tablet 768..1379.98, phone <= 767.98). Server render and
 * first client render assume desktop; the real value is read after mount.
 */
import { animate, type AnimationOptions } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

export const EASE: [number, number, number, number] = [0.44, 0, 0.56, 1];
/** Framer's default appear tween on these pages: 0.4 s, ease [0.44, 0, 0.56, 1]. */
export const TWEEN_04: AnimationOptions = { type: "tween", duration: 0.4, ease: EASE, delay: 0 };
/** Hero appear spring on /blogs, /faq and /contact: damping 60, mass 1.2, stiffness 300, delay 0.2. */
export const HERO_SPRING: AnimationOptions = { type: "spring", damping: 60, mass: 1.2, stiffness: 300, delay: 0.2 };

export function Appear({
  as: Tag = "div",
  y,
  transition,
  className,
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  /** Enter offset (Framer `__framer__enter.y`); opacity always enters from 0. */
  y: number;
  transition: AnimationOptions;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<`data-${string}`, string | undefined>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ctrl: { stop: () => void } | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        ctrl = animate(el, { opacity: [0, 1], y: [y, 0] }, transition);
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ctrl?.stop();
    };
    // Plays once, like Framer's animateOnce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Tag ref={ref} className={className} style={{ ...style, willChange: "transform", opacity: 0, transform: `translateY(${y}px)` }} {...rest}>
      {children}
    </Tag>
  );
}

export type Breakpoint = "desktop" | "tablet" | "phone";
const PHONE = "(max-width: 767.98px)";
const TABLET = "(min-width: 768px) and (max-width: 1379.98px)";

function current(): Breakpoint {
  if (window.matchMedia(PHONE).matches) return "phone";
  if (window.matchMedia(TABLET).matches) return "tablet";
  return "desktop";
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop");
  useEffect(() => {
    const update = () => setBp(current());
    update();
    const mqs = [window.matchMedia(PHONE), window.matchMedia(TABLET)];
    mqs.forEach((m) => m.addEventListener("change", update));
    return () => mqs.forEach((m) => m.removeEventListener("change", update));
  }, []);
  return bp;
}
