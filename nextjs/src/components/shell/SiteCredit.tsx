/**
 * "Site by Kelin Studio" credit band directly under the footer, as production carries it
 * (scripts/inject-site-credit.py in the static mirror): footer colour, small muted centred text, one link.
 * Not on the Framer site, so qa/compare.mjs and qa/heights.mjs hide #ibm-site-credit when comparing.
 */
export function SiteCredit() {
  return (
    <div
      id="ibm-site-credit"
      style={{
        width: "100%",
        background: "var(--token-080e1a25-cec7-42ff-8f40-b5b92f071114, rgb(26, 69, 60))",
        color: "rgba(255, 255, 255, 0.45)",
        textAlign: "center",
        padding: "0 16px 20px",
        fontFamily: '"Instrument Sans", "Instrument Sans Placeholder", sans-serif',
        fontSize: 12,
        lineHeight: 1.6,
        letterSpacing: "0.02em",
      }}
    >
      Site by{" "}
      <a href="https://kelin.studio" style={{ color: "rgba(255, 255, 255, 0.65)", textDecoration: "none" }}>
        Kelin Studio
      </a>
    </div>
  );
}
