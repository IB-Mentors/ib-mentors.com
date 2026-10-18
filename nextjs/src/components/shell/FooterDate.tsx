"use client";

import { useSyncExternalStore } from "react";

/**
 * Framer code component "Time & Date" (script_main `tt`): outputType "date", weekday + year + short month, rendered
 * with the visitor's clock in the page locale (ja), e.g. 2026年9月23日水曜日. Framer server-renders it hidden and
 * shows it once mounted; it re-checks the clock every second.
 */
const FMT = new Intl.DateTimeFormat("ja", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
const now = () => FMT.format(new Date());
function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
}
const noop = () => () => {};

export function FooterDate() {
  const text = useSyncExternalStore(subscribe, now, now);
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return (
    <p
      suppressHydrationWarning
      style={{
        margin: 0,
        padding: 0,
        color: "var(--token-e29f80cc-7c19-42a6-a7c7-b923c17868bb, rgba(255, 255, 255, 0.7))",
        fontFamily: '"Instrument Sans", "Instrument Sans Placeholder", sans-serif',
        fontWeight: 400,
        fontSize: 16,
        lineHeight: "1.7em",
        visibility: mounted ? "visible" : "hidden",
        fontStyle: "normal",
        letterSpacing: "0em",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </p>
  );
}
