// Framer layers carry CSS custom properties inline (--border-*, --variable-reference-*, component padding vars).
import "react";
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
