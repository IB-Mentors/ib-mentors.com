import type { Mentor } from "@/content/teams";

/**
 * STUB with a fixed props contract (courses/teams builder fills in the visuals). Framer component "Team Card"
 * (qa/framer-src/Zyjm7l3ce.*.mjs). Used on / (home builder imports it) and /teams. Variants: "Desktop Team Card",
 * "Secondary", "Tertiary", or { desktop, tablet?, phone? }. Links to /teams/<slug>.
 */
export type TeamCardVariant = string | { desktop: string; tablet?: string; phone?: string };

export function TeamCard({ mentor, variant, className }: { mentor: Mentor; variant?: TeamCardVariant; className?: string }) {
  void variant;
  return (
    <a href={`/teams/${mentor.slug}`} className={className} data-framer-name="Desktop Team Card">
      {mentor.name}
    </a>
  );
}
