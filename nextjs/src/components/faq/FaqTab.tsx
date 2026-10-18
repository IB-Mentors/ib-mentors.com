"use client";
/**
 * Framer "Faq Tab 01" / "Faq Tab 02" (x44xsz38*.mjs) with their "FAQ  Card"s.
 *
 * Behaviour, as the Framer variants wire it: the tab's variant says which card is open (Variant 1..4, first card
 * open by default). Tapping a closed card opens it and closes the others; tapping the open card closes it (the card
 * flips its own variant while the tab's stays). The page never switches the tab to its phone variants, so every
 * breakpoint uses the "Desktop FAQ  Card" variants.
 *
 * Motion: the card resizes with Framer's layout animation on the card's spring (stiffness 200, damping 30, mass 1)
 * and its background cross-fades on the same spring; the cards below move with the tab's tween (0.4 s,
 * [0.44, 0, 0.56, 1]). Text colour and the +/- icon swap immediately, as on the live site.
 * All answers are in the HTML; closed ones are display:none.
 */
import { motion, type Transition } from "motion/react";
import { useState } from "react";
import type { FaqGroup } from "./faqData";
import s from "./FaqPage.module.css";

const CARD_SPRING: Transition = { type: "spring", stiffness: 200, damping: 30, mass: 1 };
const TAB_TWEEN: Transition = { type: "tween", duration: 0.4, ease: [0.44, 0, 0.56, 1] };
const NAVY = "rgb(10, 34, 107)";
const WHITE = "rgb(255, 255, 255)";

export function FaqTab({ group }: { group: FaqGroup }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={s.tab} data-framer-name="Variant 1">
      <div className={s.tabTitle} data-framer-name="Title">
        <h4 className={`p-1goqrxy ${s.navy}`}>{group.title}</h4>
      </div>
      <div className={s.tabCards} data-framer-name="Card Wrapper">
        {group.items.map((item, i) => {
          const isOpen = open === i;
          const toggle = () => setOpen((o) => (o === i ? null : i));
          return (
            <motion.div key={i} className={s.cardContainer} layout="position" transition={TAB_TWEEN}>
              <motion.div
                layout
                className={`${s.card}${isOpen ? ` ${s.cardOpen}` : ""}`}
                data-framer-name={isOpen ? "Desktop FAQ  Card Open" : "Desktop FAQ  Card Close"}
                initial={false}
                animate={{ backgroundColor: isOpen ? NAVY : WHITE }}
                transition={CARD_SPRING}
                style={{ borderRadius: 40 }}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={toggle}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle();
                  }
                }}
              >
                <motion.div layout="position" transition={CARD_SPRING} className={s.questionRow} data-framer-name="Question & Icon">
                  <div className={s.question} data-framer-name="Question">
                    <p className="p-ztkeh">{item.q}</p>
                  </div>
                  <div className={s.icon} data-framer-name="Icon">
                    {isOpen ? (
                      <img className={s.iconImg} src="/framer/ttaoaJ9KfCha6TLZidvseWJL8zw.svg" alt="Icon" width={12} height={2} />
                    ) : (
                      <img className={s.iconImg} src="/framer/UjNHVkStng7ZZFEmXRLkUlGooo.svg" alt="Icon" width={12} height={12} />
                    )}
                  </div>
                </motion.div>
                <motion.div layout="position" transition={CARD_SPRING} className={s.answer} data-framer-name="Answer" hidden={!isOpen}>
                  <p className="p-1magne6">{item.a}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
