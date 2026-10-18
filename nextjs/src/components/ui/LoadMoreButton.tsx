"use client";

import s from "./LoadMoreButton.module.css";

/**
 * Framer component "Load More Button" (qa/framer-src/mwYJaWKu3.*.mjs, framer-fTrwl). Variants: "Load More V1"
 * (/blogs: dark pill, the hidden first "Title" reads "Load More" and swaps to もっと見る while it slides in on hover,
 * tween 0.4s [0.44, 0, 0.56, 1]), "Load More V2" (static, one title), and the states "Loading" (padding 16/60, the
 * masked conic spinner fading in over 0.3s and turning once a second) and "Hidden" (renders nothing).
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

export function LoadMoreButton({ variant = "Load More V1", label = "もっと見る", loading, hidden, onClick, className }: LoadMoreProps) {
  if (hidden) return null;
  const v1 = variant === "Load More V1";
  return (
    <button
      type="button"
      className={`${s.btn}${v1 && !loading ? ` ${s.swipe}` : ""}${loading ? ` ${s.loading}` : ""}${className ? ` ${className}` : ""}`}
      data-framer-name={loading ? "Loading" : variant}
      onClick={onClick}
      disabled={loading}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <div className={s.spinner} data-framer-name="Spinner">
          <div className={s.conic} data-framer-name="Conic">
            <div className={s.round} data-framer-name="Round" />
          </div>
        </div>
      ) : (
        <div className={s.titles} data-framer-name="Title Wrapper">
          {v1 && (
            <div className={`${s.title} ${s.titleIn}`} data-framer-name="Title">
              <p className="p-w4t77b">
                <span className={s.idle}>Load More</span>
                <span className={s.hot}>{label}</span>
              </p>
            </div>
          )}
          <div className={`${s.title} ${s.titleOut}`} data-framer-name="Title">
            <p className="p-w4t77b">{label}</p>
          </div>
        </div>
      )}
    </button>
  );
}
