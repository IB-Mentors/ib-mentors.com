// Site-wide constants. Values are what the Framer site and the static mirror already carry.
export const SITE_URL = "https://ib-mentors.com";
export const OG_IMAGE = `${SITE_URL}/SocialPreview.png`;
export const BRAND = "IBメンター";
export const BRAND_EN = "IB Mentors";
/** LINE official account: every "LINEで無料相談" CTA on the Framer site points here. */
export const LINE_URL = "https://lin.ee/EPTH4OI";
/** Real addresses, as printed on /contact. The footer uses EMAIL_INFO (Framer's footer had the template's
 *  placeholder `mailto: info@elearning.com`, replaced 19 Oct 2026). */
export const EMAIL_SUPPORT = "support@ib-mentors.com";
export const EMAIL_INFO = "info@ib-mentors.com";
/** Breakpoints of THIS Framer project (not Framer's 1200/810 default). Same values as globals.css. */
export const BREAKPOINTS = { desktop: 1380, tabletMin: 768 } as const;
