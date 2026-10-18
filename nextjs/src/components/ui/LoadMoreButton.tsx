"use client";

/**
 * STUB with a fixed props contract (shell builder fills in the visuals). Framer component "Load More Button"
 * (qa/framer-src/mwYJaWKu3.*.mjs). Variants: "Load More V1" (/blogs), "Load More V2" (/blogs, /courses), and the
 * states "Loading" and "Hidden" (once the collection is exhausted). Label on the site: もっと見る.
 * Used by /blogs (blogs builder) and /courses, /teams (courses builder); they own the paging logic and pass state.
 */
export type LoadMoreProps = {
  variant?: "Load More V1" | "Load More V2";
  label?: string;
  loading?: boolean;
  /** Framer's "Hidden" state: nothing left to load. */
  hidden?: boolean;
  onClick: () => void;
  className?: string;
};

export function LoadMoreButton({ label = "もっと見る", loading, hidden, onClick, className }: LoadMoreProps) {
  if (hidden) return null;
  return (
    <button type="button" className={className} onClick={onClick} disabled={loading}>
      {label}
    </button>
  );
}
