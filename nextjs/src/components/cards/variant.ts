/** Per-breakpoint variant helpers shared by the two cards (desktop >= 1380, tablet 768..1379.98, phone <= 767.98). */
export type BreakpointVariant<V extends string> = V | { desktop: V; tablet?: V; phone?: V };

export function splitVariant<V extends string>(variant: BreakpointVariant<V> | undefined, fallback: V): { d: V; t: V; p: V } {
  if (!variant) return { d: fallback, t: fallback, p: fallback };
  if (typeof variant === "string") return { d: variant, t: variant, p: variant };
  return { d: variant.desktop, t: variant.tablet ?? variant.desktop, p: variant.phone ?? variant.desktop };
}
