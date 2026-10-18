"use client";
/**
 * The /blogs card grid with Framer's paginated collection list: page size 6 on desktop and tablet, 3 on phone
 * (breakpoint override `JCNer00mr: { pageSize: 3 }` in yMu5HGDW*.mjs). もっと見る shows the "Loading" state briefly
 * (Framer resolves the next page asynchronously, ~70-400 ms on the live site), then reveals the next page; once the
 * collection is exhausted the button takes the "Hidden" state. Every card is in the server HTML; the ones beyond
 * the current page are hidden with CSS per breakpoint, so the first paint matches Framer's at every width.
 */
import { useRef, useState } from "react";
import { LoadMoreButton } from "@/components/ui/LoadMoreButton";
import { BLOG_POSTS } from "@/content/blogs";
import { BlogCard } from "./BlogCard";
import s from "./BlogsPage.module.css";

const PAGE = 6;
const PAGE_PHONE = 3;
const LOADING_MS = 150;

export function BlogGrid() {
  // Pages loaded so far (Framer's currentPage). Desktop/tablet and phone page through the same counter.
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = BLOG_POSTS.length;

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setPages((p) => p + 1);
      setLoading(false);
    }, LOADING_MS);
  };

  const shownWide = Math.min(total, PAGE * pages);
  const shownPhone = Math.min(total, PAGE_PHONE * pages);

  return (
    <div className={s.grid}>
      {BLOG_POSTS.map((post, i) => {
        const hide = `${i >= shownWide ? ` ${s.hideWide}` : ""}${i >= shownPhone ? ` ${s.hidePhoneCard}` : ""}`;
        return (
          <div key={post.slug} className={`${s.cardContainer}${hide}`}>
            <BlogCard
              href={`/blogs/${post.slug}`}
              image={post.cardImage ?? (post.image ? { src: post.image.src, alt: "Image" } : null)}
              category={post.category}
              title={post.title}
              date={post.date}
              author={post.author ?? ""}
            />
          </div>
        );
      })}
      <div className={`${s.loadMore} hide-tablet hide-phone`}>
        <LoadMoreButton variant="Load More V1" loading={loading} hidden={shownWide >= total} onClick={loadMore} />
      </div>
      <div className={`${s.loadMore} hide-desktop hide-phone`}>
        <LoadMoreButton variant="Load More V2" loading={loading} hidden={shownWide >= total} onClick={loadMore} />
      </div>
      <div className={`${s.loadMore} hide-desktop hide-tablet`}>
        <LoadMoreButton variant="Load More V2" loading={loading} hidden={shownPhone >= total} onClick={loadMore} />
      </div>
    </div>
  );
}
