/** Framer Image fill: an absolutely positioned wrapper (inherits the frame's radius) holding the <img>. */
export function FImg({ src, alt = "", fit = "cover", pos = "center", lazy = true, className }: { src: string; alt?: string; fit?: string; pos?: string; lazy?: boolean; className?: string }) {
  return (
    <div className={className} style={{ position: "absolute", borderRadius: "inherit", inset: 0 }}>
      <img
        src={src}
        alt={alt}
        decoding="async"
        loading={lazy ? "lazy" : undefined}
        style={{ display: "block", width: "100%", height: "100%", borderRadius: "inherit", objectPosition: pos, objectFit: fit as React.CSSProperties["objectFit"] }}
      />
    </div>
  );
}
