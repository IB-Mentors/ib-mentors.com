import { Page } from "@/components/shell/Page";

/**
 * STUB (courses builder fills this in). Route /teams. Grid of TeamCard.
 * Sections, in order, each root carrying data-section="<Framer layer name>" for qa/compare.mjs:
 *   Hero Section / Team Section
 */
export function TeamsPage() {
  return (
    <Page>
      <section data-section="Hero Section" />
      <section data-section="Team Section" />
    </Page>
  );
}
