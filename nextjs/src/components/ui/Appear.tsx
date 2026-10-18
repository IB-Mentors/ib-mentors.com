"use client";

import { motion, type Transition } from "motion/react";

/**
 * Framer appear effect (`__framer__styleAppearEffectEnabled` + `__framer__animateOnce` + `__framer__threshold`):
 * the element starts at `from` (Framer's `__framer__enter`, e.g. { opacity: 0, y: 50 }) and animates to its resting
 * state the first time `amount` of it is in the viewport. `transition` is Framer's `__framer__animate.transition`.
 * `x` lets a centred layer keep Framer's transformTemplate (e.g. "-50%" for translateX(-50%)).
 */
type Tag = "div" | "section" | "p" | "h2" | "a";
export type AppearProps = {
  as?: Tag;
  from: { opacity?: number; x?: number | string; y?: number; scale?: number };
  transition: Transition;
  amount?: number;
  x?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  "data-framer-name"?: string;
};

export function Appear({ as = "div", from, transition, amount = 0, x, children, className, style, ...rest }: AppearProps) {
  const M = motion[as] as typeof motion.div;
  const rest0 = { opacity: 1, y: 0, scale: 1, ...(x !== undefined ? { x } : { x: 0 }) };
  const init = { ...rest0, ...from, ...(x !== undefined ? { x } : {}) };
  return (
    <M
      className={className}
      style={style}
      initial={init}
      whileInView={rest0}
      viewport={{ once: true, amount }}
      transition={transition}
      {...rest}
    >
      {children}
    </M>
  );
}
