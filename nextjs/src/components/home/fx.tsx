"use client";

import { Children, Fragment, isValidElement, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const EASE: [number, number, number, number] = [0.44, 0, 0.56, 1];

/**
 * Hero appear-on-load (`data-framer-appear-id` + the `<script type="framer/appear">` JSON): from y 40 / opacity
 * 0.001 to rest, tween [0.44, 0, 0.56, 1] (`duration` 0.4s for Title Wrapper, 0.5s for Card Wrapper).
 */
export function LoadAppear({ duration, className, children, ...rest }: { duration: number; className?: string; children: React.ReactNode; "data-framer-name"?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.001, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "tween", duration, ease: EASE, delay: 0 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * The "Content" scroll appear used by most home sections: `__framer__enter` { opacity: 0, y: 60 },
 * tween 0.4s [0.44, 0, 0.56, 1], once, threshold 0.
 */
export function ScrollAppear({ className, children, as = "div", ...rest }: { className?: string; children: React.ReactNode; as?: "div" | "section"; "data-framer-name"?: string }) {
  const M = as === "section" ? motion.section : motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ type: "tween", duration: 0.4, ease: EASE, delay: 0 }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Framer `whileHover` scale (Search Bar: scale 1.05, spring bounce 0.2 / 0.4s). */
export function HoverScaleLink({ className, href, children, scale = 1.05, ...rest }: { className?: string; href: string; children: React.ReactNode; scale?: number; target?: string; "data-framer-name"?: string }) {
  return (
    <motion.a className={className} href={href} whileHover={{ scale, transition: { type: "spring", bounce: 0.2, duration: 0.4 } }} {...rest}>
      {children}
    </motion.a>
  );
}

const SANS = '"Instrument Sans", "Instrument Sans Placeholder", sans-serif';
const SERIF = '"Instrument Serif", "Instrument Serif Placeholder", serif';
const WHITE = "var(--token-7815bd49-9bc8-4647-bba4-8c93a9b00cc9, rgb(255, 255, 255))";

/**
 * Framer code component inside "Counter Card" (`Ar` in the Home module): counts from `start` to `end` by 1 every
 * 30ms from mount (startOnViewport off) and restarts from `start` every time it enters the viewport
 * (restartOnViewport on). Prefix span (empty), number span, suffix span, exactly as Framer renders them.
 */
export function Counter({
  start,
  end,
  suffix = "",
  size,
  color = WHITE,
  prefixColor = WHITE,
  suffixColor = WHITE,
  suffixSerif = false,
}: {
  start: number;
  end: number;
  suffix?: string;
  size: number;
  color?: string;
  prefixColor?: string;
  suffixColor?: string;
  suffixSerif?: boolean;
}) {
  const [n, setN] = useState(start);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) setN(start);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [start]);
  useEffect(() => {
    if (n >= end) return;
    const t = window.setTimeout(() => setN((v) => (v + 1 >= end ? end : v + 1)), 30);
    return () => window.clearTimeout(t);
  }, [n, end]);
  return (
    <div
      ref={ref}
      style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "0px", flexDirection: "row", fontSize: `${size}px`, fontFamily: SANS, fontWeight: 400, color }}
    >
      <span style={{ fontFamily: SANS, fontWeight: 400, color: prefixColor }} />
      <span>{n.toFixed(0)}</span>
      <span style={{ fontFamily: suffixSerif ? SERIF : SANS, fontWeight: 400, color: suffixColor }}>{suffix}</span>
    </div>
  );
}

/**
 * Framer "Ticker" code component (the `an` function in the Home module), as the Brand Section uses it: direction
 * left, `speed` px/s, `gap` px, no fade (fadeWidth 0), hoverFactor 1. It measures one set of slots, appends
 * round(parent / set * 2) + 1 copies and loops translateX(0 -> -distance) linearly forever.
 */
export function Ticker({ gap, speed, children }: { gap: number; speed: number; children: React.ReactNode }) {
  const top = Children.toArray(children);
  const only = top[0];
  const slots =
    top.length === 1 && isValidElement<{ children?: React.ReactNode }>(only) && only.type === Fragment ? Children.toArray(only.props.children) : top;
  const sec = useRef<HTMLElement>(null);
  const ul = useRef<HTMLUListElement>(null);
  const first = useRef<HTMLLIElement>(null);
  const last = useRef<HTMLLIElement>(null);
  const [size, setSize] = useState<{ parent: number; children: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      if (!sec.current || !first.current || !last.current) return;
      const parent = sec.current.offsetWidth;
      const kids = last.current.offsetLeft + last.current.offsetWidth - first.current.offsetLeft + gap;
      setSize((p) => (p && p.parent === parent && p.children === kids ? p : { parent, children: kids }));
    };
    const ro = new ResizeObserver(measure);
    if (sec.current) ro.observe(sec.current);
    return () => ro.disconnect();
  }, [gap]);

  const copies = size ? Math.min(Math.round((size.parent / size.children) * 2) + 1, 100) : 0;
  const dist = size ? size.children + size.children * Math.round(size.parent / size.children) : 0;

  useEffect(() => {
    if (!ul.current || !dist || !speed) return;
    const a = ul.current.animate({ transform: ["translateX(-0px)", `translateX(-${dist}px)`] }, { duration: (Math.abs(dist) / speed) * 1000, iterations: Infinity, easing: "linear" });
    const vis = () => (document.hidden ? a.pause() : a.play());
    document.addEventListener("visibilitychange", vis);
    return () => {
      document.removeEventListener("visibilitychange", vis);
      a.cancel();
    };
  }, [dist, speed]);

  const mask = "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%, rgba(0, 0, 0, 0) 100%)";
  const box: React.CSSProperties = { display: "flex", width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", placeItems: "center", margin: 0, padding: 0, listStyleType: "none", textIndent: "none" };
  return (
    <section ref={sec} style={{ ...box, padding: "0px", opacity: size ? 1 : 0, WebkitMaskImage: mask, maskImage: mask, overflow: "hidden" }}>
      <ul ref={ul} style={{ ...box, gap: `${gap}px`, position: "relative", flexDirection: "row", willChange: "transform", transform: "translateX(-0px)" }}>
        {slots.map((c, i) => (
          <li key={`o${i}`} ref={i === 0 ? first : i === slots.length - 1 ? last : undefined}>
            {c}
          </li>
        ))}
        {Array.from({ length: copies }).flatMap((_, k) =>
          slots.map((c, i) => (
            <li key={`c${k}-${i}`} aria-hidden="true">
              {c}
            </li>
          )),
        )}
      </ul>
    </section>
  );
}
