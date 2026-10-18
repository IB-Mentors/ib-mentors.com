"use client";
import { motion, type Transition } from "motion/react";

/**
 * Framer "style appear" effect (`__framer__styleAppearEffectEnabled`, `__framer__animateOnce`, threshold 0):
 * the element starts at `from` (Framer SSRs it as opacity:0 + translateY) and animates to rest once it
 * enters the viewport. The two presets used on the courses / teams / 404 pages:
 *   HERO:    { opacity: 0, y: 50 } spring stiffness 300, damping 60, mass 1.2, delay 0.2
 *   SECTION: { opacity: 0, y: 60 } tween 0.4 s, ease [0.44, 0, 0.56, 1]
 */
export const HERO_APPEAR = {
  from: { opacity: 0, y: 50 },
  transition: { type: "spring", stiffness: 300, damping: 60, mass: 1.2, delay: 0.2 } as Transition,
};
export const SECTION_APPEAR = {
  from: { opacity: 0, y: 60 },
  transition: { type: "tween", duration: 0.4, ease: [0.44, 0, 0.56, 1], delay: 0 } as Transition,
};

export function Appear({
  preset,
  className,
  children,
  name,
}: {
  preset: { from: { opacity: number; y: number }; transition: Transition };
  className?: string;
  children?: React.ReactNode;
  /** Framer layer name (data-framer-name) */
  name?: string;
}) {
  return (
    <motion.div
      className={className}
      data-framer-name={name}
      initial={preset.from}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={preset.transition}
    >
      {children}
    </motion.div>
  );
}
