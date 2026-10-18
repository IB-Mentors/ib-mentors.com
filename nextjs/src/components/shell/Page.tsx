import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { SiteCredit } from "./SiteCredit";

/**
 * The frame every route renders in, as Framer lays it out:
 *   <Navigation>  Framer "Header" (component "Navigation": Desktop / Tablet Closed / Phone Closed + the open menu).
 *                 It overlays the top of the page: main starts at y=0 under it on every route.
 *   <main>        page sections
 *   <Footer>      Framer "Footer Section" (component "Footer": Desktop / Tablet / Phone)
 *   <SiteCredit>  "Site by Kelin Studio" band under the footer (production only; not on the Framer site)
 * Owner: shell builder. Page builders only pass children.
 */
export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <Navigation />
      <main data-framer-name="Main" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {children}
      </main>
      <Footer />
      <SiteCredit />
    </div>
  );
}
