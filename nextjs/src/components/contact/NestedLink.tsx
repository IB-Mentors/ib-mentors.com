"use client";
/**
 * Framer's nested link: a link inside a link card renders as
 * <span data-nested-link role="link" tabindex="0" href=... target=...> and opens on click without following the card.
 * Same markup here (the href attribute is kept verbatim on the span, as Framer does).
 */
export function NestedLink({ href, target, className, children }: { href: string; target?: string; className?: string; children: React.ReactNode }) {
  const go = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (target === "_blank") window.open(href, "_blank");
    else window.location.href = href;
  };
  return (
    <span
      className={className}
      {...({ href, target, rel: "" } as Record<string, string>)}
      data-nested-link="true"
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter") go(e);
      }}
    >
      {children}
    </span>
  );
}
